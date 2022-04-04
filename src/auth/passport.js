const passport = require('passport');
const userRepository = require('../user/repositories/user.repository');

passport.serializeUser(function (user, done) {
  console.log(`serializing user (strategy:${user.passportStrategy}): ${user.username} #${user.id}`);
  const finalUser = {
    id: user.id,
    email: user.email,
    strategy: user.passportStrategy,
  }
  done(null, finalUser);
});

passport.deserializeUser(async (serializedUser, done) => {
  console.log("deserializing token: ", serializedUser.email);
  try {
    const user = await userRepository.get.byId(serializedUser.id);
    if (!user) return done(null, false);

    return done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

require('./strategies/local.strategy');
