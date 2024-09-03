const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Payment Intent Schema
const paymentIntentSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness of the PaymentIntent ID
    },
    amount: {
        type: Number,
        required: true, // Required, as it's critical for financial records
    },
    currency: {
        type: String,
        required: true,
        enum: ['usd', 'eur', 'gbp'], // Limit to specific currencies
    },
    payment_method: {
        type: String,
        required: true, // Required, identifies the payment method
    },
    status: {
        type: String,
        required: true,
        enum: ['succeeded', 'requires_payment_method', 'canceled', 'processing', 'requires_action'], // Important statuses
    },
    customer: {
        type: String,
        default: null, // Optional, can be null if not associated with a customer
    },
    created: {
        type: Number,
        required: true, // Required, to track when the payment was made
    },
    latest_charge: {
        type: String,
        default: null, // Optional, can be null if not applicable
    },
    amount_received: {
        type: Number,
        default: null, // Optional, captures the actual amount received
    },
    client_secret: {
        type: String,
        default: null, // Optional, may be needed for client-side actions
    },
    metadata: {
        type: Map,
        of: String,
        default: {}, // Optional, to store additional information
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

const SubscriptionSchema = new mongoose.Schema({
    subscriptionId: {
        type: String,
        required: true,
        unique: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    current_period_start: {
        type: Date,
        required: true,
    },
    current_period_end: {
        type: Date,
        required: true,
    },
    plan: {
        id: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        interval: { type: String, required: true },
        product: { type: String, required: true },
    },
    items: [{
        itemId: { type: String, required: true },
        priceId: { type: String, required: true },
        quantity: { type: Number, required: true },
    }],
    latest_invoice: {
        id: { type: String, required: true },
        amount_due: { type: Number, required: true },
        amount_paid: { type: Number, required: true },
        currency: { type: String, required: true },
        status: { type: String, required: true },
        hosted_invoice_url: { type: String },
        invoice_pdf: { type: String },
    },
    created: {
        type: Date,
        required: true,
    },
    livemode: {
        type: Boolean,
        required: true,
    },
    metadata: {
        type: Map,
        of: String,
    }
},{
    timestamps: true,
});

// Subscription Schema
// const SubscriptionItemSchema = new Schema({
//     itemId: {
//         type: String,
//         required: true,
//     },
//     planId: {
//         type: String,
//         required: true,
//     },
//     quantity: {
//         type: Number,
//         required: true,
//     },
//     amount: {
//         type: Number,
//         required: true,
//     },
//     currency: {
//         type: String,
//         required: true,
//     },
//     interval: {
//         type: String,
//         required: true,
//     },
// });

// const SubscriptionSchema = new Schema({
//     subscriptionId: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     status: {
//         type: String,
//         required: true,
//     },
//     customerId: {
//         type: String,
//         required: true,
//     },
//     startDate: {
//         type: Date,
//         required: true,
//     },
//     currentPeriodStart: {
//         type: Date,
//         required: true,
//     },
//     currentPeriodEnd: {
//         type: Date,
//         required: true,
//     },
//     cancelAtPeriodEnd: {
//         type: Boolean,
//         default: false,
//     },
//     currency: {
//         type: String,
//         required: true,
//     },
//     planId: {
//         type: String,
//         required: true,
//     },
//     amount: {
//         type: Number,
//         required: true,
//     },
//     interval: {
//         type: String,
//         required: true,
//     },
//     latestInvoice: {
//         type: String,
//         required: true,
//     },
//     items: [SubscriptionItemSchema],
// }, {
//     timestamps: true,
// });

// Creating and exporting models
const PaymentIntentDB = mongoose.model('PaymentIntent', paymentIntentSchema);
const SubscriptionDB = mongoose.model('Subscription', SubscriptionSchema);

module.exports = {
    PaymentIntentDB,
    SubscriptionDB
};
