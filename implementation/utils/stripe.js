const stripe = require("../config/stripe")

const createOrFindCustomer = async (user) =>{
    
    let customer = await stripe.customers.list({ email: user.email });
    if (customer.data.length === 0) {
         customer = await stripe.customers.create({
            email: user.email,
            name : user.firstName +" "+ user.lastName,
        });
    } else {
         customer = customer.data[0];
    }
    return customer;
}

module.exports = {
    createOrFindCustomer
}