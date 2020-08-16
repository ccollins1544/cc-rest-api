const passport = require("passport");
const LocalStrategy = require("./passportStrategy");

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
  done(null, user);
});

// user object attaches to the request as req.user
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

//  Use Strategies
passport.use(LocalStrategy);

module.exports = passport;
