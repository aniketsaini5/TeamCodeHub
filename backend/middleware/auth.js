const express = require('express');
const passport = require('passport');
const router = express.Router();

// GitHub Auth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: process.env.CLIENT_URL || 'http://localhost:5173'
    }),
    (req, res) => {
        // Successful authentication
        res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    }
);

// Logout Route
router.post('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json({ error: "Failed to logout" });
        }
        res.json({ success: true });
    });
});

module.exports = router;