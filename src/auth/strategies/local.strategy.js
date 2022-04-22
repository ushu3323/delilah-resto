const { sha256 } = require("js-sha256");
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const userRepository = require("../../user/repositories/user.repository");

passport.use(new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: true,
  },
  async (email, password, done) => {
    console.log("Autenticando: ", email)
    const badAuthMsg = "Usuario o contraseña incorrectos";
    try {
      const user = await userRepository.get.byEmail(email);
      if (!user) return done(null, false, { message: badAuthMsg });
      let credential = (await user.getCredentials({
        where: { provider_name: 'local' }
      }))[0];
      
      if (!credential || credential.password !== sha256(password)) return done(null, false, { message: badAuthMsg });
      if (!user.enabled) return done(null, false, { message: "Usuario deshabilitado" });
      
      user.passportStrategy = credential.provider_name;
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));