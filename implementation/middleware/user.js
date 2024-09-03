const express = require('express');
const jwt = require('jsonwebtoken');
const user = require("../models/users");
const { userRegister, userLogin} = require("../utils/validation");

const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ status: "false", message: "Auth Token not found" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userData = await user.findById(decoded.id);
        req.user = userData;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ status: "false", message: error });
    }
};


const userRegisterMiddleware = (req,res,next) => {
    const { error } = userRegister.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details[0].message
        });
    }
    next();
}

const userLoginMiddleware = (req,res,next) => {
    const { error } = userLogin.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details[0].message
        });
    }
    next();
}

module.exports = {
    authMiddleware,
    userRegisterMiddleware,
    userLoginMiddleware
}