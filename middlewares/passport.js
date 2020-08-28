const passport = require("passport");
const LocalStrategy = require("./passportStrategy");
const db = require("../models");

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
  done(null, { _id: user._id });
});

// user object attaches to the request as req.user
passport.deserializeUser((obj, done) => {
  db.User.findOne(obj, {
    email: 1,
    last_used_token: 1,
  }).then((dbModel) => done(null, dbModel));
});

//  Use Strategies
passport.use(LocalStrategy);

module.exports = passport;
