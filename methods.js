const fs = require("fs");
const jwt = require("jsonwebtoken");

module.exports.ensureToken = function (req, res, next) {
  var bearerHeader = req.headers["authorization"];

  let token = "";
  if (typeof bearerHeader !== "undefined") {
    token = bearerHeader.split(" ")[1].toString();
  } else if (req.session.token !== "undefined") {
    token = req.session.token;
  }

  if (token) {
    let publicKey = fs.readFileSync("public.pem", "utf8");

    var iss = process.env.ISSUER || "christopher";
    var sub = process.env.SUBJECT || "chris@ccollins.io";
    var aud = process.env.AUDIENCE || "https://ccollins.io";
    var exp = process.env.EXPIRATION || "1h";

    var verifyOptions = {
      issuer: iss,
      subject: sub,
      audience: aud,
      maxAge: exp,
      algorithms: ["RS256"],
    };

    console.log("token", token);
    jwt.verify(token, publicKey, verifyOptions, (err, result) => {
      if (err) {
        console.log(err);
        req.session.token = null;
        req.session.login = false;
        req.session.username = null;

        res.status(403).send({
          ok: false,
          error: err,
        });
      } else {
        console.log("\n Verified: " + JSON.stringify(result));
        req.session.login = true;
        req.session.username = result.username;
        req.session.iat = result.iat;
        req.session.exp = result.exp;
        req.session.aud = result.aud;
        req.session.iss = result.iss;
        req.session.sub = result.sub;

        return next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};
