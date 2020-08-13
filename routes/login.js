const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Test Credentials
let username = process.env.USERNAME || "demo";
let password = process.env.PASSWORD || "123456";

// POST /login
router.post("/", (req, res, next) => {
  let p_username = req.body.username;
  let p_password = req.body.password;

  if (p_username == username && p_password == password) {
    var privateKey = fs.readFileSync(
      path.resolve(__dirname, "../private.pem"),
      "utf8",
    );

    let payload = {
      username: username,
    };

    // console.log("Payload: " + JSON.stringify(payload, null, 2));

    var iss = process.env.ISSUER || "christopher";
    var sub = process.env.SUBJECT || "chris@ccollins.io";
    var aud = process.env.AUDIENCE || "https://ccollins.io";
    var exp = process.env.EXPIRATION || "1h";

    var signOptions = {
      issuer: iss,
      subject: sub,
      audience: aud,
      expiresIn: exp,
      algorithm: "RS256",
    };

    jwt.sign(
      payload,
      { key: privateKey, passphrase: "" },
      signOptions,
      (err, token) => {
        if (err) {
          console.log(err);
          req.session.token = null;
          req.session.login = false;
          req.session.username = null;

          res.status(500).send({
            ok: false,
            error: err,
          });
        } else {
          req.session.token = token;
          req.session.login = true;
          req.session.username = username;

          res.status(200).send({
            ok: true,
            message: "Login successful",
            username: username,
            token: token,
          });
        }
      },
    );
  } else {
    res.status(401).send({
      ok: false,
      message: "Username or password incorrect",
    });
  }
});

// GET /login
router.get("/", (req, res, next) => {
  let jadeProps = {
    site_title: "CC REST API",
    page_title: "Login",
    slug: "login",
    fa_script: process.env.FA_SCRIPT || false,
    login: req.session.login,
    username: req.session.username,
    iat: req.session.iat,
    exp: req.session.exp,
  };

  res.render("login", jadeProps);
});

module.exports = router;
