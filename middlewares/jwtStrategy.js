process.env.DOTENV_LOADED || require("dotenv").config();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// ========================[ validateAccessToken ]==================================
const validateAccessToken = (req, res, next) => {
  // Pull token from header or session
  const { authorization } = req.headers;
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
      if (process.env.DEBUG !== undefined && process.env.DEBUG == "true") {
        console.log("token:", token);
        console.log("decodedToken:", JSON.stringify(decodedToken, null, 2));
      }

      let { header, payload } = decodedToken;
      let { alg } = header;
      let { email, iat, exp, aud, iss, sub } = payload;

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
          req.session.email = null;
          req.session.token = null;
          req.session.payload = null;
          req.session.logged_in = false;

          return res.status(403).send({
            ok: false,
            error: err,
            message: "Failed to verify token",
          });
        } else {
          if (process.env.DEBUG !== undefined && process.env.DEBUG == "true") {
            console.log("Verified:", JSON.stringify(result, null, 2));
          }

          req.session.email = result.email;
          req.session.token = token;
          req.session.payload = result;
          req.session.logged_in = true;

          return next();
        }
      });
    } catch (err) {
      console.log(err);
      req.session.email = null;
      req.session.token = null;
      req.session.payload = null;
      req.session.logged_in = false;

      return res.status(403).send({
        ok: false,
        error: err,
        message: "Token was provided but was invalid",
      });
    }
  } else {
    if (req.originalUrl === "/") {
      return res.redirect("/login");
    } else {
      return res.sendStatus(403);
    }
  }
};

// ========================[ createAccessToken ]==================================
const createAccessToken = (req, res, next) => {
  let { email } = req.body;

  if (!email) {
    return res.status(403).send({
      ok: false,
      error: err,
      message: "Must provide email in request body",
    });
  }

  let privateKey = fs.readFileSync(
    path.resolve(__dirname, "../private.pem"),
    "utf8",
  );

  let payload = {
    email: email,
  };

  if (process.env.DEBUG !== undefined && process.env.DEBUG == "true") {
    console.log("Payload: " + JSON.stringify(payload, null, 2));
  }

  let signOptions = {
    issuer: process.env.ISSUER || "Heroku",
    subject: process.env.SUBJECT || "cc-rest-api",
    audience:
      process.env.AUDIENCE || "https://ancient-bastion-93975.herokuapp.com/",
    expiresIn: process.env.EXPIRATION || "1h",
    algorithm: "RS256",
  };

  jwt.sign(
    payload,
    { key: privateKey, passphrase: "" },
    signOptions,
    (err, token) => {
      if (err) {
        console.log(err);

        req.session.email = null;
        req.session.token = null;
        req.session.payload = null;

        return res.status(500).send({
          ok: false,
          error: err,
          message: "Failed to create token",
        });
      }

      req.session.email = email;
      req.session.token = token;
      req.session.payload = payload;

      return next();
    },
  );
};

module.exports = { validateAccessToken, createAccessToken };
