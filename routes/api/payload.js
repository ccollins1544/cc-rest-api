const router = require("express").Router();
const methods = require("../../middlewares/jwtStrategy");

// Matches with "/api/payload" GET
router.route("/").get(methods.validateAccessToken, (req, res, next) => {
  res.status(200).send(req.session.payload);
});

module.exports = router;
