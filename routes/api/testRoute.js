const router = require("express").Router();

// Matches with "/api/test"
router.route("/").get((req, res, next) => {
  res.status(200).send({
    ok: true,
    message: "Test Route",
  });
});

module.exports = router;
