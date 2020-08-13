const router = require("express").Router();
const methods = require("../../methods");

// Matches with "/api/token"
router.route("/").get(methods.validateAccessToken, (req, res, next) => {
  res.status(200).send({ token: res.locals.token });
});

module.exports = router;
