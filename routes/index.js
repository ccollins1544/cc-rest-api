const express = require("express");
const router = express.Router();
const methods = require("../middlewares/jwtStrategy");
const userController = require("../controllers/user");

const userRouter = require("./user");
const loginRouter = require("./login");
const logoutRouter = require("./logout");
const apiRouter = require("./api");

router.use("/user", userRouter);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/api", apiRouter);

// Matches with "/" GET
router.get(
  "/",
  methods.validateAccessToken,
  userController.login,
  (req, res, next) => {
    if (process.env.DEBUG !== undefined) {
      console.log("SESSION", req.session);
    }

    let jadeProps = {
      site_title: "CC REST API",
      page_title: "Home",
      slug: "home",
      fa_script: process.env.FA_SCRIPT || false,
      demo_user: process.env.DEMO_USER || false,
      logged_in: req.session.logged_in,
      email: req.session.email,
      token: req.session.token,
      payload: req.session.payload,
    };

    res.render("index", jadeProps);
  },
);

module.exports = router;
