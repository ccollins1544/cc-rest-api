var express = require("express");
var methods = require("../methods");
var router = express.Router();

/* GET home page. */
router.get("/", methods.ensureToken, (req, res, next) => {
  res.render("index", { title: "Express" });
});

module.exports = router;
