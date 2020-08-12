const express = require("express");
const router = express.Router();
const methods = require("../methods");

const loginRouter = require("./login");
const logoutRouter = require("./logout");
const api_routes = require("./api");

router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/api", api_routes);

// GET home page.
router.get("/", methods.validateAccessToken, (req, res, next) => {
  let jadeProps = {
    site_title: "CC REST API",
    page_title: "Home",
    slug: "home",
    fa_script: process.env.FA_SCRIPT || false,
    login: req.session.login,
    username: req.session.username,
    iat: req.session.iat,
    exp: req.session.exp,
  };

  res.render("index", jadeProps);
});

module.exports = router;
