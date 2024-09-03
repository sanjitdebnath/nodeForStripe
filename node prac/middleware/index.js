const fs = require("fs");
const logReqRes = () => {
    return (req, res, next) => {
        const now = new Date();
        const localTime = now.toLocaleString();
        const log = `${localTime} : ${req.url} new request received\n`;
        fs.appendFile('./log', log, (err, result) => {
            if (!err) {
                next();
            } else {
                res.json("there is some error : " + err);
            }
        })
    }
}

module.exports = {logReqRes};