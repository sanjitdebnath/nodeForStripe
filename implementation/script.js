require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const path = require("path")
app.use(bodyParser.json());
const mongoDbConnect = require("./connection");
const paymentRouters = require("./routes/payment")
const userRouters = require("./routes/user")
app.use(express.static("public"))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/payment",paymentRouters)
app.use("/user",userRouters)

mongoDbConnect("mongodb://localhost:27017/stripe-integration");
app.listen(8000,()=> console.log("server nunning at port 8000"));