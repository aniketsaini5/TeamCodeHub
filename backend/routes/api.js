const express = require('express');
const router = express.Router();

// Auth status endpoint
router.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        // Don't send sensitive info to client
        const { _id, githubId, username, displayName, avatarUrl } = req.user;
        return res.json({ isAuthenticated: true, user: { id: _id, githubId, username, name: displayName, avatar: avatarUrl } });
    }
    return res.status(401).json({ isAuthenticated: false });
});

module.exports = router;