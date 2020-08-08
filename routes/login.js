var fs = require("fs");
const path = require("path");
var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

// Test Credentials
const username = "billy";
const password = "123456";

router.post("/", (req, res, next) => {
  let p_username = req.body.username;
  let p_password = req.body.password;

  if (p_username == username && p_password == password) {
    // sign with RSA SHA256
    var privateKey = fs.readFileSync(path.resolve(__dirname, "../api.key"));
    // var expInSeconds = 60;
    // var expEpoch = Math.floor(Date.now() / 1000) + expInSeconds;

    var token = jwt.sign(
      {
        // exp: Math.floor(Date.now() / 1000) + (60 * 60),
        username: username,
      },
      "my-secret",
      // privateKey,
      // { algorithm: "HS256", expiresIn: "1h" },
      // { algorithm: "HS256" },
      (err, token) => {
        console.log("token", token);

        res.send({
          ok: true,
          message: "Login successful",
          username: username,
          token: token,
          // exp_epoch: expEpoch,
        });
      },
    );
  } else {
    res.send({
      ok: false,
      message: "Username or password incorrect",
    });
  }
});

module.exports = router;
