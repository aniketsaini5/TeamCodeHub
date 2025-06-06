const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const terminalController = require('../controllers/terminalController');
const isAuthenticated = require('../middleware/auth');

// Middleware to ensure user is authenticated
router.use(isAuthenticated);

// Create a new project
router.post('/', projectController.createProject);

// Get all projects for the authenticated user
router.get('/', projectController.getProjects);

// Get a single project by ID
router.get('/:id', projectController.getProjectById);

// Update a project file
router.post('/file', projectController.updateFile);

// Run code
router.post('/run', projectController.runCode);

router.post('/execute', terminalController.executeTerminalCommand);

router.delete('/:projectId/files/:fileName', projectController.deleteFile);

router.put('/:projectId/files/:fileName/rename', projectController.renameFile);

module.exports = router;