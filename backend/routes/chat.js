const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const isAuthenticated = require('../middleware/auth');

// Middleware to ensure user is authenticated
router.use(isAuthenticated);

// Save a chat message
router.post('/messages', chatController.saveMessage);

// Get chat messages for a project
router.get('/messages/:projectId', chatController.getMessages);

module.exports = router;