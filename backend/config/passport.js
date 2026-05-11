const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const env = require('./env');

passport.use(new GoogleStrategy({
  clientID:     env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL:  env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Google info
    const googleUser = {
      name:       profile.displayName,
      email:      profile.emails[0].value,
      avatar_url: profile.photos[0].value,
      class_level: 6,  // Google login এ class 
    };
    return done(null, googleUser);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;