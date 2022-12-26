require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const Loaders = require("./database/mongodb");
const LinkModel = require("./database/model");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

Loaders.start();

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;
  const linkTable = await LinkModel.create({
    original_url: url,
    short_url: (await LinkModel.find()).length + 1,
  });
  res.json({
    original_url: url,
    short_url: linkTable.short_url,
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
