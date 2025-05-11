const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const isAuthenticated = require('../middleware/auth');

// Middleware to ensure user is authenticated
router.use(isAuthenticated);

// Create a GitHub repository for the project
router.post('/create-repo', githubController.createRepo);

// Push code to GitHub
router.post('/push', githubController.pushToGitHub);

module.exports = router;