const express = require("express");
const router = express.Router();
const {generateUrl,callUrl,getAnalytics,deleteUrl} = require("../controllers/url")

router.post("/", generateUrl);
router.route("/:shortId") .get(callUrl).delete(deleteUrl);
router.get("/analytics/:shortId", getAnalytics);

module.exports = router;
