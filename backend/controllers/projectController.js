const Project = require('../models/Project');

// Get all projects for a user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const { projectName, cloneLink, authorizationPass, frontendEnv, backendEnv } = req.body;
    
    if (!projectName || !cloneLink || !authorizationPass) {
      return res.status(400).json({ error: 'Project name, clone link, and authorization password are required' });
    }
    
    const newProject = new Project({
      projectName,
      cloneLink,
      authorizationPass,
      frontendEnv: frontendEnv || '',
      backendEnv: backendEnv || '',
      user: req.user.userId
    });
    
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, cloneLink, authorizationPass, frontendEnv, backendEnv } = req.body;
    
    if (!projectName || !cloneLink || !authorizationPass) {
      return res.status(400).json({ error: 'Project name, clone link, and authorization password are required' });
    }
    
    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      {
        projectName,
        cloneLink,
        authorizationPass,
        frontendEnv: frontendEnv || '',
        backendEnv: backendEnv || ''
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }
    
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Error updating project' });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProject = await Project.findOneAndDelete({ _id: id, user: req.user.userId });
    
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
