const express = require("express")
const router = express.Router()
const {paymentIntentMiddleware} = require("../middleware/payment")
const {authMiddleware} = require("../middleware/user")

const {createIntent,subscription,handleWebhook} = require("../controller/paymentController")
router.post("/createIntent",[authMiddleware,paymentIntentMiddleware],createIntent);
router.post("/createSubscription",authMiddleware,subscription);
router.post('/webhook', express.raw({type: 'application/json'}),handleWebhook);

module.exports = router;
