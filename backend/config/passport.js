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
    try {
      // Extract email and other profile details
      const email = profile.emails?.[0]?.value || null; // Extract email safely
      const githubProfile = {
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        email, // Use the extracted email directly
        avatarUrl: profile.photos?.[0]?.value,
        profileUrl: profile.profileUrl
      };

      // Check if the user already exists
      let user = await User.findOne({ githubId: profile.id });

      if (user) {
        // Update existing user's details
        user.accessToken = accessToken;
        user.email = email; // Update email if it has changed
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // Create a new user if not found
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

  // Serialize user ID into the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};