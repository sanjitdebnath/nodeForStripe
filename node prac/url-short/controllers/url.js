const url = require("../models/url");
const shortid = require("shortid");

const generateUrl = async (req, res) => {
    const body = req.body;
    console.log(body);
    const shortId = shortid(8);
    if (!body.url) return res.status(400).json({ "error": "url is required" });
    await url.create({
        shortId: shortId,
        RedirectUrl: body.url,
        visitHistory: []

    });
    res.json({ "shortUrl": "http://localhost:8000/api/url/" + shortId });
}

const callUrl = async (req, res) => {
    const shortId = req.params.shortId;
    if(!shortId){
        res.status(400).json({"status":false,"message":"Required shortID"})
    }
    try {
        const entry = await url.findOneAndUpdate({
            shortId
        },
            {
                $push: {
                    visitHistory: {
                        timestamps: Date.now()
                    }
                }
            }
        );

        if(!entry){
            res.status(400).json({"status":false,"message":"Invalid shortID"})
        }else{
            res.redirect(entry.RedirectUrl);
        }
    } catch (err) {
        res.status(500).send({error:err, message: 'An error occurred while registering the user.'});
    }
}

const getAnalytics = async (req, res) => {
    const shortId = req.params.shortId;
    if(!shortId){
        res.status(400).json({"status":false,"message":"Required shortID"})
    }
    const analytics = await url.findOne({
        shortId
    });
    if(!analytics){
        res.status(404).json({ "status": false, "message": "analytics not found" });
    }else{
        res.send({ "totalCount": analytics.visitHistory.length, "analytics": analytics.visitHistory });
    }
}
const deleteUrl = async (req, res) => {
    const shortId = req.params.shortId;
    if(!shortId){
        res.status(400).json({"status":false,"message":"Required shortID"})
    }
    const analytics = await url.findOneAndDelete({
        shortId
    });
    if(!analytics){
        res.status(404).json({ "status": false, "message": "analytics not found" });
    }else{
        res.json({ "status": true, "message": "analytics deleted successfully" });
    }
}
module.exports = {
    generateUrl,
    callUrl,
    getAnalytics,
    deleteUrl
}

