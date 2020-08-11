const express = require("express");
const methods = require("../methods");
const router = express.Router();

// GET home page.
router.get("/", methods.ensureToken, (req, res, next) => {
  // router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

module.exports = router;
