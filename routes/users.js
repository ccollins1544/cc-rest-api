const express = require("express");
const methods = require("../methods");
const router = express.Router();

/* GET users listing. */
router.get("/", methods.validateAccessToken, (req, res, next) => {
  let jadeProps = {
    site_title: "CC REST API",
    page_title: "Users",
    login: req.session.login,
    username: req.session.username,
    iat: req.session.iat,
    exp: req.session.exp,
  };

  res.render("users", {
    ...jadeProps,
    users: { 1: "Mike", 2: "Lucas", 3: "Dustin" },
  });
});

module.exports = router;
