const router = require("express").Router();
const methods = require("../../methods");

// Matches with "/api/payload"
router.route("/").get(methods.validateAccessToken, (req, res, next) => {
  res.status(200).send(res.locals.payload);
});

module.exports = router;
