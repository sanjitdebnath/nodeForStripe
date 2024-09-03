const user = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {createOrFindCustomer } = require("../utils/stripe")
const user_register = async (body) => {
    try {
        const customer =  await createOrFindCustomer(body);
        const result = await user.create({
            firstName: body.firstName,
            lastName: body.lastName,
            username: body.username,
            email: body.email,
            password: body.password,
            stripeCustomerId: customer.id || '',
        })
        const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, { expiresIn: '4h' });
        return { message: "user Created successfully", id: result.id,token: token };
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.username) {
            return {
                error: 'username is already in use. Please use a different username.',
            };
        } else if (err.code === 11000 && err.keyPattern.email) {
            return {
                error: 'email is already in use. Please use a different email address.',
            };
        }
        return { error: 'An error occurred while registering the user.' };
    }
}
const user_login = async (newUser) => {
    try {
        const userData = await user.findOne({email: newUser.email }).select('+password');
        if (!userData) {
            return { status: false, message: "User not found" };
        }
        const isMatch = await bcrypt.compare(newUser.password, userData.password);
        if (!isMatch) {
            return { status: false, message: "Invalid credentials" };
        } else {
            const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, { expiresIn: '4h' });
            return { status: true, message: "login success", token: token };
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

module.exports = {
    user_register,
    user_login
}