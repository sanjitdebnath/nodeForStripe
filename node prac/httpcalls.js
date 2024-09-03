const http = require('http');
const fs = require("fs");
const url = require("url");

const myserver = http.createServer((req, res) => {
    let urls = url.parse(req.url,true)
    if(urls.pathname == '/favicon.ico')
    {
        res.end("404 Not Found");
    }
    const log = `${Date.now()} : ${req.url} new request received\n`;
    fs.appendFile('./log', log, (err, result) => {
        if(!err){
            switch (urls.pathname) {
                case '/': res.end("hello server is working fine");
                    break;
                case '/about': 
                    const name = urls.query.name;
                    res.end(`hello i am ${name}`);
                    break;
                default:res.end("404 Not Found");
                    break;
            }
        }
    })
})

const port = 8000;

myserver.listen(port, () => console.log(`server running on port ${port}`))