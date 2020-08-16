const express = require("express");
const router = express.Router();

// Matches with "/logout" DELETE
router.delete("/", (req, res, next) => {
  if (req.session) {
    req.logout();
    req.session.destroy();
    req.session = null; // for cookie based sessions

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
