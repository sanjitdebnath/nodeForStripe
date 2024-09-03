const express = require("express");
const mongoDbConnect = require("./connection");
const urlRoutes = require("./routes/url");
const renderRoute = require("./routes/renderRoute");
const path = require("path");

const app = express();
const PORT = 8000;
app.set("view engine", "ejs");
app.set("views", path.resolve("url-short/views"));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoDbConnect("mongodb://localhost:27017/url-short");
app.use("/api/url", urlRoutes);
app.use("/renderRoute/url", renderRoute);

app.listen(PORT, () => { console.log(`Api running at PORT Number ${PORT}`) })