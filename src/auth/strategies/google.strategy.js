const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const config = require('../../config')
const User = require('../../user/model/User');
const userRepository = require('../../user/repositories/user.repository');
const Credential = require('../model/Credential');


passport.use(new GoogleStrategy({
    clientID: config.auth.google.clientID,
    clientSecret: config.auth.google.clientSecret,
    callbackURL: config.auth.google.callback_url
  },
  async function (accessToken, refreshToken, profile, done) {
    console.log('Verify Google');
    const googleEmail = profile.emails.find((email) => email.verified)?.value;
    if (!googleEmail) return done(null, false, { message: "El usuario no tiene un email verificado"})
    try {
      let user = await userRepository.get.byCredential({
        provider_name: "google",
        provider_userId: profile.id
      });
      
      if (user){
        user.passportStrategy = 'google'
        console.log("Found user:", user.username);
        // Update accessToken and refreshToken
        let credential = await user.getCredentials({where: {provider_name: "google"}, plain: true})
        console.log(credential);
        await credential.update({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        return done(null, user);
      } 
        
      user = await userRepository.create({
        username: googleEmail.split("@")[0],
        fullName: profile.displayName,
        email: googleEmail,
        phoneNumber: "",
        address: "",
        enabled: true
      }, {
        provider_userId: profile.id,
        provider_name: "google",
        access_token: accessToken,
        refresh_token: refreshToken
      });
      console.log("Created user: ", user.username);
      user.passportStrategy = 'google'   
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));