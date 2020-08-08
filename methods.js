const fs = require("fs");
const jwt = require("jsonwebtoken");

module.exports.ensureToken = function (req, res, next) {
  var bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    let token = bearerHeader.split(" ")[1].toString();
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

        res.status(403).send({
          ok: false,
          error: err,
        });
      } else {
        console.log("\n Verified: " + JSON.stringify(result));
        return next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};
