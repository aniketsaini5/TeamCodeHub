const express = require('express');
const router = express.Router();

// Auth status endpoint
router.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    // Don't send sensitive info to client
    const { _id, githubId, username, displayName, avatarUrl } = req.user;
    return res.json({ 
      isAuthenticated: true, 
      user: { 
        id: _id, 
        githubId, 
        username, 
        name: displayName || username, 
        avatar: avatarUrl 
      } 
    });
  }
  return res.json({ isAuthenticated: false });
});

// User dashboard data
router.get('/user/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // This would typically fetch projects and other user data
  // For now, we'll just return the user info
  const { _id, username, displayName, avatarUrl } = req.user;
  
  res.json({
    user: {
      id: _id,
      username,
      name: displayName || username,
      avatar: avatarUrl
    },
    projects: [] // This would be populated from the database
  });
});

module.exports = router;