const router = require("express").Router();
const methods = require("../../middlewares/jwtStrategy");
const userController = require("../../controllers/user");

// Matches with "/api/payload" GET
router
  .route("/")
  .get(methods.validateAccessToken, userController.login, (req, res, next) => {
    res.status(200).send(req.session.payload);
  });

module.exports = router;
