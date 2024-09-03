const express = require("express");
const fs = require("fs");
const userData = require('./MOCK_DATA.json')

const app = express();
app.use(express.urlencoded({ extended: false }))
const PORT = 8000;


app.use((req, res, next) => {
    const log = `${Date.now()} : ${req.url} new request received\n`;
    fs.appendFile('./log', log, (err, result) => {
        if(!err){
           next();
        }else{
            res.json("there is some error : "+err);
        }
    })
})

const userAuth = (req, res, next) => {
    res.send("hello");
}


app.get("/api/users",userAuth, (req, res) => {
    res.json(userData);
})
app.get("/users", (req, res) => {
    let html = `   
    <style>
        body{
            width:100%;
            display:flex;
            justify-content:center;
            align-items:center;
            flex-direction:column;
        }
        td{
            padding:7px 10px;
        }
        h1{
            text-align:center;
        }
    </style>
    <body>
        <h1>This a sample User List</h1>
        <table border="1" cellspacing="0">
            ${userData.map((user) => `<tr>
            <td>${user.id}</td>
            <td>${user.first_name}</td>
            <td>${user.first_name}</td>
            <td>${user.email}</td>
            <td>${user.gender}</td>
            </tr>`).join("")}
        </table>
    </body> 
    `;
    res.send(html);
})


app.route("/api/user/:id").get((req, res) => {
    const id = req.params.id;
    const user = userData.find((user) => user.id == id);
    res.json(user);
}).patch((req, res) => {
    const id = req.params.id;
    const body = req.body;
    const user = userData.find((user) => user.id == id);

    for (const key in body) {
        user[key] = body[key];
    }
    userData.splice(id - 1, 1, user);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(userData), (err, result) => {
        if (!err) {
            res.json({ 'message': "user updated succesfully" });
        } else {
            res.json({ 'err': err });
        }
    })
}).delete((req, res) => {
    const id = req.params.id;
    const body = req.body;
    const user = userData.find((user) => user.id == id);

    for (const key in body) {
        user[key] = body[key];
    }
    userData.splice(id - 1, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(userData), (err, result) => {
        if (!err) {
            res.json({ 'message': "user deleted succesfully" });
        } else {
            res.json({ 'err': err });
        }
    })
})

app.post("/api/user", (req, res) => {
    const body = req.body;
    userData.push({ ...body, id: userData.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(userData), (err, result) => {
        if (!err) {
            res.json({ 'message': "user created succesfully", "id": userData.length });
        } else {
            res.json({ 'err': err });
        }
    })
    console.log(body);
})

app.listen(PORT, () => { console.log(`Api running at PORT Number ${PORT}`) })