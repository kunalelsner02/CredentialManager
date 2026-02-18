const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');

const router = express.Router();

// Apply authentication middleware to all project routes
router.use(authenticateToken);

// Get all projects
router.get('/', getProjects);

// Create new project
router.post('/', createProject);

// Update project
router.put('/:id', updateProject);

// Delete project
router.delete('/:id', deleteProject);

module.exports = router;
