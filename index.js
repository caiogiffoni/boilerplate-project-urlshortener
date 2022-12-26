require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const Loaders = require("./database/mongodb");
const LinkModel = require("./database/model");
const dns = require("node:dns");

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

const isValidUrl = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);

  try {
    const validUrl = new URL(req.body.url);
    if (validUrl.origin === "null") {
      console.log("null URL");
      console.log({ error: "invalid url" });
      return res.json({ error: "invalid url" });
    } else {
      console.log("try dns.lookup()");
      dns.lookup(validUrl.hostname, (err, addr, family) => {
        if (err || !addr) {
          console.log(`failed dns.lookup() on URL: ${req.body.url}`);
          console.log({ error: "invalid hostname" });
          return res.json({ error: "invalid hostname" });
        }
        console.log(`no dns.lookup() errors, ${req.body.url} must be valid`);
        next();
      });
    }
  } catch (err) {
    console.log(err);
    console.log("caught error");
    console.log({ error: "invalid url" });
    return res.json({ error: "invalid url" });
  }
};

app.post("/api/shorturl", isValidUrl, async (req, res) => {
  const { url } = req.body;
  const alredyCreatedLink = await LinkModel.findOne({ original_url: url });
  if (alredyCreatedLink) {
    return res.json({
      original_url: url,
      short_url: alredyCreatedLink.short_url,
    });
  }
  const linkTable = await LinkModel.create({
    original_url: url,
    short_url: (await LinkModel.find()).length + 1,
  });
  return res.json({
    original_url: url,
    short_url: linkTable.short_url,
  });
});

app.get("/api/shorturl/:short", async (req, res) => {
  const { short } = req.params;
  const alredyCreatedLink = await LinkModel.findOne({ short_url: short });
  res.redirect(alredyCreatedLink.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
