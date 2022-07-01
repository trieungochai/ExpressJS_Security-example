const express = require("express");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const path = require("path");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const cookieSession = require("cookie-session");

const app = express();
require("dotenv").config();

app.use(helmet());

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2], // 'secret key'
  })
);

app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google profile", profile);
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

function checkLoggedIn(req, res, next) {
  const isLoggedIn = true; // TODO
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in!",
    });
  }

  next();
}

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate(
    "google",
    {
      successRedirect: "/",
      failureRedirect: "/auth/google/failure",
      session: false,
    },
    (req, res) => {
      console.log("Google called back us!");
    }
  )
);

app.get("/auth/google/failure", (req, res) => {
  return res.send("Failed to login!");
});

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
