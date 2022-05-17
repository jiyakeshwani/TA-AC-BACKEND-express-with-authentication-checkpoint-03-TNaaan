var passport = require("passport");
var GithubStrategy = require("passport-github").Strategy;
var googleStrategy = require("passport-google").Strategy;

var User = require("../models/user");

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: " /auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      var profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile._json.email,
        photo: profile._json.avatar_url,
      };
      user.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            return done(null, addedUser);
          });
        }
        done(null, user);
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      var email = profile._json.email;
      var googleUser = {
        email: email,
        providers: [profile.provider],
        google: {
          name: profile._json.name,
          username: `${profile.name.familyName} ${profile.name.givenName}`,
          image: profile.photos[0].value,
        },
      };
      User.findOne({ email }, (err, user) => {
        if (err) return cb(err, false);
        if (!user) {
          User.create(googleUser, (err, user) => {
            if (err) return cb(err, false);
            cb(null, user);
          });
        } else if (user.providers.includes(profile.provider)) {
          return cb(err, user);
        } else {
          user.providers.push(profile.provider);
          user.google = { ...googleUser.google };
          user.save((err, updatedUser) => {
            cb(null, updatedUser);
          });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, "name , email , username", (err, user) => {
    done(err, user);
  });
});
module.exports = passport;
