require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { main } = require("./database/db");
const app = express();
const Loaders = require("./database/mongodb");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

Loaders.start();

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  console.log("caio");
  console.log(req.body);
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const x = req.body;
  console.log(x);
  res.json({ lalala: "banana" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
