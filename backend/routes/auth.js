const express = require('express');
const passport = require('passport');
const router = express.Router();

// GitHub OAuth route
router.get('/github', (req, res, next) => {
    console.log("GitHub OAuth flow started"); // Log when the route is accessed
    next();
  }, passport.authenticate('github', { scope: ['user:email', 'repo'] }));

// GitHub OAuth callback route
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: process.env.CLIENT_URL || 'http://localhost:5173' }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// router.get(
//     "//github/callback",
//     (req, res, next) => {
//         console.log("Authorization Code:", req.query.code); // Log the code
//         next();
//     },
//     passport.authenticate("github", { failureRedirect: "/" }),
//     (req, res) => {
//         res.redirect(`${process.env.CLIENT_URL}/dashboard`);
//     }
// );
// Logout Route
router.post('/logout', (req, res) => {
    req.logout(function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });


//   router.post('/logout', (req, res) => {
//     req.logout(function (err) {
//         if (err) {
//             return res.status(500).json({ error: "Failed to logout" });
//         }
//         // Redirect to the homepage
//         res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
//     });
// });


module.exports = router;