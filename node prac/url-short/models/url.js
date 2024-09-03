const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique : true
    },
    RedirectUrl: {
        type: String,
        required : true
    },
    visitHistory: [{timestamps : { type : Number}}]
}, { timestamps: true })

const url = mongoose.model("url", urlSchema);

module.exports = url;