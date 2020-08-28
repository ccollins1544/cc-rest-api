const db = require("../models/");
const LocalStrategy = require("passport-local").Strategy;

const strategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true, // allows us to pass the entire request to the callback.
  },
  function (req, email, password, done) {
    db.User.findOne({
      email: email,
    }).then((dbUser) => {
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect username",
        });
      }
      if (!dbUser.checkPassword(password)) {
        return done(null, false, {
          message: "Incorrect password",
        });
      }
      return done(null, dbUser);
    });
  },
);

module.exports = strategy;
