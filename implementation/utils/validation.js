const Joi = require('joi');
// payment Intent Schema validation
const paymentIntentSchema = Joi.object({
    amount: Joi.number().required(),
    currency: Joi.string().valid('usd', 'eur', 'gbp').required(),
    paymentMethod: Joi.string().required(),
    userData: Joi.string().required(),
    save_card:Joi.boolean()
});

const userRegister = Joi.object({
    firstName: Joi.string()
        .trim()
        .max(50)
        .required()
        .messages({
            'string.empty': 'First name is required',
            'string.max': 'First name cannot exceed 50 characters',
        }),
    lastName: Joi.string()
        .trim()
        .max(50)
        .required()
        .messages({
            'string.empty': 'Last name is required',
            'string.max': 'Last name cannot exceed 50 characters',
        }),
    username: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot exceed 30 characters',
        }),
    email: Joi.string()
        .email()
        .trim()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
        }),
});

const userLogin = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required',
        }),
});

module.exports = {
    paymentIntentSchema,
    userRegister,
    userLogin
}