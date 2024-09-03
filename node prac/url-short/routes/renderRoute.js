const express = require("express");
const router = express.Router();
const {getRenderedAnalytics,getRenderedForm} = require("../controllers/renderController")


router.get("/get-rendered-analytics",getRenderedAnalytics)
router.get("/get-rendered-form",getRenderedForm)
module.exports = router;