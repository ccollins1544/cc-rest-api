const router = require("express").Router();
const methods = require("../../middlewares/jwtStrategy");

// Matches with "/api/token" GET
router.route("/").get(methods.validateAccessToken, (req, res, next) => {
  res.status(200).send({ token: req.session.token });
});

module.exports = router;
