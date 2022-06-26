const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/secret", (req, res) => {
  return res.status(200).send("Your personal secret value is 69!");
});

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
