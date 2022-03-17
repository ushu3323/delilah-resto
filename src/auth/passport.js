const passport = require('passport');

passport.serializeUser(function (user, done) {
  console.log("serializing user: ", user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log("deserializing user: ", user);
  done(null, user);
});


module.exports = passport;