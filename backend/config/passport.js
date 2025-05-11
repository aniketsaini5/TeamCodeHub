const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = (app) => {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email', 'repo']
  }, async (accessToken, refreshToken, profile, done) => {
    // Log the profile and access token for debugging
    console.log("GitHub Access Token:", accessToken);
    console.log("GitHub Callback URL:", process.env.GITHUB_CALLBACK_URL);
    console.log("GitHub Profile:", profile);
    try {
      console.log("GitHub Access Token:", accessToken);
      const githubProfile = {
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        email: profile.emails?.[0]?.value || null, // Handle case where email is not provided,
        avatarUrl: profile.photos?.[0]?.value,
        profileUrl: profile.profileUrl
      };

      let user = await User.findOne({ githubId: profile.id });

      if (user) {
        // Update existing user's access token
        user.accessToken = accessToken;
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        ...githubProfile,
        accessToken,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      return done(null, user);
    } catch (error) {
      console.error('GitHub OAuth Error:', error);
      return done(error, null);
    }
  }));

  // Serialize/deserialize
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

};