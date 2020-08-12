const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Test Credentials
let username = process.env.USERNAME || "ccollins";
let password = process.env.PASSWORD || "123456";

// POST /logout
router.delete("/", (req, res, next) => {
  if (req.session.token || req.session.token || req.session.username) {
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
