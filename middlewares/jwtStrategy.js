process.env.DOTENV_LOADED || require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// =========================[ config ]=========================
const jwt_config = {
  development: {
    issuer: process.env.ISSUER || "beta",
    subject: process.env.SUBJECT || require("../package.json").name,
    audience: process.env.AUDIENCE || "http://localhost:3000",
    expiresIn: parseInt(process.env.EXPIRATION) / 1000 || "1h", // raw integer must be in seconds 
    algorithm: "RS256",
    passphrase: process.env.SESSION_SECRET || "SuperSecretSession"
  },
  test: {
    issuer: process.env.ISSUER || "beta",
    subject: process.env.SUBJECT || require("../package.json").name,
    audience: process.env.AUDIENCE || "http://localhost:3000",
    expiresIn: parseInt(process.env.EXPIRATION) / 1000 || "1h", // raw integer must be in seconds 
    algorithm: "RS256",
    passphrase: process.env.SESSION_SECRET || "SuperSecretSession"
  },
  production: {
    issuer: process.env.ISSUER || "beta",
    subject: process.env.SUBJECT || require("../package.json").name,
    audience: process.env.AUDIENCE || "http://localhost:3000",
    expiresIn: parseInt(process.env.EXPIRATION) / 1000 || "1h", // raw integer must be in seconds 
    algorithm: "RS256",
    passphrase: process.env.SESSION_SECRET || "SuperSecretSession"
  }
};

const config = jwt_config[env];

// ========================[ validateAccessToken ]==================================
const validateAccessToken = (req, res, next) => {
  if (process.env.OVERRIDE_LOGIN !== undefined && process.env.OVERRIDE_LOGIN === "true") {
    return next();
  }

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

      if (env !== "production") {
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

          console.log("Failed to verify token!".red);
          return res.status(403).send({
            ok: false,
            error: err,
            message: "Failed to verify token",
          });

        } else {
          if (env !== "production") {
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

      console.log("Token was provided but was invalid!".red);
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

  let signOptions = {
    issuer: config.issuer,
    subject: config.subject,
    audience: config.audience,
    expiresIn: config.expiresIn,
    algorithm: config.algorithm,
  };

  jwt.sign(
    payload,
    {
      key: privateKey,
      passphrase: config.passphrase
    },
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
