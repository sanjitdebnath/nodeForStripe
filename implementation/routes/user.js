const express = require('express');
const router = express.Router();
const {userRegisterMiddleware,authMiddleware,userLoginMiddleware} = require("../middleware/user")
const userController = require("../controller/userController")

router.post('/register',userRegisterMiddleware, userController.register);
router.post('/login',userLoginMiddleware, userController.login);
router.get('/check-token',authMiddleware,(req,res)=>{
    res.json(req.user);
});

module.exports = router;