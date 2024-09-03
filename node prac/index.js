const express = require("express");
const mongoDbConnect = require("./connection");
const userRoutes = require("./routes/user");
const {logReqRes} = require("./middleware/index");

const app = express();
const PORT = 8000;

app.use(logReqRes());
app.use(express.urlencoded({ extended: false }))

mongoDbConnect("mongodb://localhost:27017/nodelearning");
app.use("/api/users",userRoutes);

app.listen(PORT, () => { console.log(`Api running at PORT Number ${PORT}`) })