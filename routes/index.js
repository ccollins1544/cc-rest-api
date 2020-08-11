const express = require("express");
const methods = require("../methods");
const router = express.Router();

// GET home page.
router.get("/", methods.ensureToken, (req, res, next) => {
  let jadeProps = {
    site_title: "CC REST API",
    page_title: "Home",
    login: req.session.login,
    username: req.session.username,
    iat: req.session.iat,
    exp: req.session.exp,
  };

  res.render("index", jadeProps);
});

module.exports = router;
