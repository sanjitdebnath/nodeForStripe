const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const uploadController = require('../controllers/uploadController');
const userController = require('../controllers/userController');

const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ status: "false", message: "Auth Token not found" });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ status: "false", message: "Unauthorized user" });
    }
};


router.post('/upload', uploadController.upload);
router.get('/get_AllMedia', uploadController.get_AllMedia);
router.get('/get_Media_count', uploadController.get_Media_count);
router.post('/delete_single_data', uploadController.delete_single_data);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.profile);

module.exports = router;

