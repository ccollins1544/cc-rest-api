const express = require("express");
const router = express.Router();

const passport = require("../middlewares/passport");
const methods = require("../middlewares/jwtStrategy");
const userController = require("../controllers/user");

// Matches with "/login" POST GET
router
  .route("/")
  .post(
    passport.authenticate("local"),
    methods.createAccessToken,
    userController.login,
  )
  .get((req, res, next) => {
    let jadeProps = {
      site_title: "CC REST API",
      page_title: "Login",
      slug: "login",
      fa_script: process.env.FA_SCRIPT || false,
      logged_in: req.session.logged_in,
      email: req.session.email,
      token: req.session.token,
      payload: req.session.payload,
    };

    res.render("login", jadeProps);
  });

module.exports = router;
