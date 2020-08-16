const router = require("express").Router();
const userController = require("../controllers/user");
const methods = require("../middlewares/jwtStrategy");

// Matches with "/user" POST
router.route("/").post(userController.create);

// Matches with "/user/:user_id" GET
router
  .route("/:user_id")
  .get(
    methods.validateAccessToken,
    userController.login,
    userController.findById,
  );

module.exports = router;
