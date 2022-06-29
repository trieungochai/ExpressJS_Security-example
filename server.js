const express = require("express");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();
const app = express();

app.use(helmet());

const PORT = process.env.PORT || 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};

function checkLoggedIn(req, res, next) {
  const isLoggedIn = true; // TODO
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in!",
    });
  }

  next();
}

app.get("/auth/google", (req, res) => {});

app.get("/auth/google/callback", (req, res) => {});

app.get("/auth/logout", (req, res) => {});

app.get("/secret", checkLoggedIn, (req, res) => {
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
