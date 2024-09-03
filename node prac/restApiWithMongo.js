const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
app.use(express.urlencoded({ extended: false }))
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/nodelearning")
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log("error while connecting : ", err));

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const user = mongoose.model("user", userSchema);

app.post("/api/user", async (req, res) => {
    const body = req.body;
    try {
        const result = await user.create({
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            gender: body.gender,
        })
        res.status(201).json({ "message": "user Created successfully", "id": result.id })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send({
                error: 'Email is already in use. Please use a different email address.',
            });
        }
        res.status(500).send({ error: 'An error occurred while registering the user.' });
    }
})

app.use((req, res, next) => {
    const log = `${Date.now()} : ${req.url} new request received\n`;
    fs.appendFile('./log', log, (err, result) => {
        if (!err) {
            next();
        } else {
            res.json("there is some error : " + err);
        }
    })
})

const userAuth = (req, res, next) => {
    // res.send("hello");
    next();
}


app.get("/api/users", userAuth, async (req, res) => {
    const result = await user.find({});
    res.json(result);
})
app.get("/users", async (req, res) => {
    const userData = await user.find({});
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
            ${userData.map((user, id) => `<tr>
            <td>${id + 1}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.gender}</td>
            </tr>`).join("")}
        </table>
    </body> 
    `;
    res.send(html);
})

app.route("/api/user/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
        const result = await user.findById(id);
        if (!result) {
            res.status(404).json({ "status": false, "message": "user not found" });
        }
        res.json({ "status": true, "data": result });
    } catch (err) {
        if (err.kind == "ObjectId") {
            res.status(400).json({ "status": false, "message": "Invalid User Id" });
        }
    }
}).patch(async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const result = await user.findByIdAndUpdate(id, 
            { $set: body }, 
            { new: true });
        if (!result) {
            res.status(404).json({ "status": false, "message": "user not found" });
        }
        res.json({ "status": true, "data": result, "message": "user updated successfully" });
    } catch (err) {
        if (err.kind == "ObjectId") {
            res.status(400).json({ "status": false, "message": "Invalid User Id" });
        }
        res.status(500).json({
            status: false,
            message: "An error occurred while updating the user"
        });
    }
}).delete( async (req, res) => {
    const id = req.params.id;
    try{
        const result = await user.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({ "status": false, "message": "user not found" });
        }else{
            res.json({ "status": true, "data": result, "message": "user deleted successfully" });
        }
    }catch(err)
    {
        if (err.kind == "ObjectId") {
            res.status(400).json({ "status": false, "message": "Invalid User Id" });
        }
        res.status(500).json({
            status: false,
            message: "An error occurred while updating the user"
        });
    }
})


app.listen(PORT, () => { console.log(`Api running at PORT Number ${PORT}`) })