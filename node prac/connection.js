const mongoose = require("mongoose");

const mongoDbConnect = async (url) =>
{
    return mongoose.connect(url)
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log("error while connecting : ", err));
}

module.exports = mongoDbConnect;