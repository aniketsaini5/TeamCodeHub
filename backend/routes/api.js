const express = require('express');
const router = express.Router();

// Auth status endpoint
router.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    // Destructure email from req.user
    const { _id, githubId, username, displayName, avatarUrl, email } = req.user;
    return res.json({ 
      isAuthenticated: true, 
      user: { 
        id: _id, 
        githubId, 
        username, 
        name: displayName || username, 
        avatar: avatarUrl,
        email // Include email in the response
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
  
  // Destructure email from req.user
  const { _id, username, displayName, avatarUrl, email } = req.user;
  
  res.json({
    user: {
      id: _id,
      username,
      name: displayName || username,
      avatar: avatarUrl,
      email // Include email in the response
    },
    projects: [] // This would be populated from the database
  });
});

module.exports = router;