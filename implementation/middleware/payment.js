const { paymentIntentSchema } = require("../utils/validation");

const paymentIntentMiddleware = (req,res,next) => {
    const { error } = paymentIntentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details[0].message
        });
    }
    next();
}

module.exports = {
    paymentIntentMiddleware
}