const express = require("express");
const methods = require("../methods");
const router = express.Router();

/* GET users listing. */
router.get("/", methods.ensureToken, (req, res, next) => {
  res.render("users", {
    title: "Express | Users",
    users: { 1: "Mike", 2: "Lucas", 3: "Dustin" },
  });
});

module.exports = router;
