const express = require("express");
const router = express.Router();

// POST /logout
router.delete("/", (req, res, next) => {
  if (req.session.login || req.session.token || req.session.username) {
    req.session.destroy();
    res.status(200).send({
      ok: true,
      message: "Logged out successful",
    });
  } else {
    res.status(203).send({
      ok: false,
      message: "No user to log out",
    });
  }
});

module.exports = router;
