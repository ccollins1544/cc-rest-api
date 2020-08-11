const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Test Credentials
let username = process.env.USERNAME || "ccollins";
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

    console.log("\n Payload: " + JSON.stringify(payload));

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

    // payload.exp = Math.floor(Date.now() / 1000) + 60 * 1;

    jwt.sign(payload, privateKey, signOptions, (err, token) => {
      console.log("token", token);

      if (err) {
        console.log(err);

        res.status(500).send({
          ok: false,
          error: err,
        });
      } else {
        res.status(200).send({
          ok: true,
          message: "Login successful",
          username: username,
          token: token,
        });
      }
    });
  } else {
    res.status(401).send({
      ok: false,
      message: "Username or password incorrect",
    });
  }
});

// GET /login
router.get("/", (req, res, next) => {
  res.render("login", { title: "Login" });
});

module.exports = router;
