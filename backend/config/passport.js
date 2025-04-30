// config/passport.js
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = (app) => {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract relevant profile information
      const githubProfile = {
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        email: profile.emails?.[0]?.value,
        avatarUrl: profile.photos?.[0]?.value,
        profileUrl: profile.profileUrl
      };

      // Check for existing user
      const existingUser = await User.findOne({ githubId: profile.id });

      if (existingUser) {
        // Update last login time
        existingUser.lastLogin = new Date();
        await existingUser.save();
        return done(null, existingUser);
      }

      // Create new user if not found
      const newUser = await User.create({
        ...githubProfile,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      return done(null, newUser);
    } catch (error) {
      console.error('GitHub OAuth Error:', error);
      return done(error, null);
    }
  }));

  // Session serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
};