const url = require("../models/url");

const getRenderedAnalytics = async (req, res) => {
    const analytics = await url.find({});
    res.render("analytics",{analytics});
}

const getRenderedForm = async (req, res) => {
    res.render("generate-url");
}

module.exports = {
    getRenderedAnalytics,
    getRenderedForm
}

