const passport = require("passport");
const LocalStrategy = require("./passportStrategy");
const db = require("../models");

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
  done(null, { id: user.id });
});

// user object attaches to the request as req.user
passport.deserializeUser((obj, done) => {
  db.User.findOne({
    attributes: ["email", "last_used_token"],
    where: obj,
  }).then((dbModel) => done(null, dbModel));
});

//  Use Strategies
passport.use(LocalStrategy);

module.exports = passport;
