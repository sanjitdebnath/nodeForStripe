const stripe = require("../config/stripe");
const { PaymentIntentDB, SubscriptionDB } = require("../models/stripe");
const { createOrFindCustomer } = require("../utils/stripe")
const createIntent = async (req, res) => {
    const reqbody = req.body;
    const userData = reqbody.user;
    const customer = await createOrFindCustomer(userData);
    if (customer.id) {
        await stripe.paymentMethods.attach(reqbody.paymentMethod, {
            customer: customer.id,
        });
        if (reqbody.save_card) {
            await stripe.customers.update(customer.id, {
                invoice_settings: {
                    default_payment_method: reqbody.paymentMethod,
                },
            });
        }
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: reqbody.amount * 100,
            currency: reqbody.currency,
            payment_method: reqbody.paymentMethod,
            customer: customer.id,
            off_session: true,
            confirm: true,
        });
        const clientSecret = paymentIntent.status;
        if (clientSecret == "succeeded") {
            await PaymentIntentDB.create(paymentIntent);
            res.status(200).json({ status: true, message: "payment successfull", clientSecret: paymentIntent.client_secret });
        } else {
            res.json({ status: false, message: paymentIntent.error });
        }
    } catch (e) {
        res.json({ status: false, message: e.message });
    }
}

const subscription = async (req, res) => {
    const customer = await createOrFindCustomer(req.user);
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: process.env.PRICE_ID }],
            expand: ['latest_invoice.payment_intent'],
        });
        await SubscriptionDB.create({
            subscriptionId: subscription.id,
            customerId: subscription.customer,
            status: subscription.status,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            plan: {
                id: subscription.plan.id,
                amount: subscription.plan.amount,
                currency: subscription.plan.currency,
                interval: subscription.plan.interval,
                product: subscription.plan.product,
            },
            items: subscription.items.data.map(item => ({
                itemId: item.id,
                priceId: item.price.id,
                quantity: item.quantity,
            })),
            latest_invoice: {
                id: subscription.latest_invoice.id,
                amount_due: subscription.latest_invoice.amount_due,
                amount_paid: subscription.latest_invoice.amount_paid,
                currency: subscription.latest_invoice.currency,
                status: subscription.latest_invoice.status,
                hosted_invoice_url: subscription.latest_invoice.hosted_invoice_url,
                invoice_pdf: subscription.latest_invoice.invoice_pdf,
            },
            created: subscription.created,
            livemode: subscription.livemode,
        })
        res.status(200).json({ status : true, message : "Subscription Created" });
    } catch (error) {
        res.status(500).json({ status : false, error: error.message });
    }
}

const handleWebhook = (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    response.send();
}

module.exports = {
    createIntent,
    subscription,
    handleWebhook,
}