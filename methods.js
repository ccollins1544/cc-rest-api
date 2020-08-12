const fs = require("fs");
const jwt = require("jsonwebtoken");

module.exports.validateAccessToken = function (req, res, next) {
  const { authorization } = req.headers;

  // Pull token from header or session
  let token = "";
  if (typeof authorization !== "undefined") {
    token = authorization.split(" ")[1].toString();
  } else if (req.session.token !== "undefined") {
    token = req.session.token;
  }

  // Validate the token
  if (token) {
    try {
      let publicKey = fs.readFileSync("public.pem", "utf8");
      let decodedToken = jwt.decode(token, { complete: true });
      // console.log("token", token);
      // console.log("decodedToken", JSON.stringify(decodedToken, null, 2));

      let { header, payload } = decodedToken;
      let { alg } = header;
      let { username, iat, exp, aud, iss, sub } = payload;

      var verifyOptions = {
        issuer: iss,
        subject: sub,
        audience: aud,
        maxAge: exp,
        algorithms: [alg],
      };

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
          // console.log("\n Verified: " + JSON.stringify(result, null, 2));
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
    } catch (err) {
      console.log(err);
      req.session.token = null;

      res.status(403).send({
        ok: false,
        error: err,
      });
    }
  } else {
    // res.sendStatus(403);
    res.redirect("/login");
  }
};
