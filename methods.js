var fs = require("fs");
var path = require("path");
let jwt = require("jsonwebtoken");

module.exports.ensureToken = function (req, res, next) {
  var bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    console.log("bearerHeader", bearerHeader);

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    console.log("bearerToken", bearerToken);
    console.log("bearerToken_", bearerHeader.split(" ")[1].toString());

    // var cert = fs.readFileSync(path.resolve(__dirname, "api.key.pub"));
    var cert = fs.readFileSync("./api.key.pub");

    // jwt.verify(bearerToken, cert, { algorithms: ["HS256"] }, (err, result) => {
    // jwt.verify(, cert, (err, result) => {
    jwt.verify(
      bearerHeader.split(" ")[1].toString(),
      "my-secret",
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(403);
        } else {
          return next();
        }
      },
    );
  } else {
    res.sendStatus(403);
  }
};
