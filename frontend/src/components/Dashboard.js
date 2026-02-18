import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects(token);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [tablePasswords, setTablePasswords] = useState({});
  const [formData, setFormData] = useState({
    projectName: '',
    cloneLink: '',
    authorizationPass: '',
    frontendEnv: '',
    backendEnv: '',
  });

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.cloneLink.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.authorizationPass.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtered projects:', filtered.length);
  }, [searchTerm, projects]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editingProject 
      ? await updateProject(editingProject._id, formData)
      : await createProject(formData);
    
    if (result.success) {
      setFormData({ projectName: '', cloneLink: '', authorizationPass: '', frontendEnv: '', backendEnv: '' });
      setShowModal(false);
      setEditingProject(null);
      setShowPassword(false);
    } else {
      console.error('Error saving project:', result.error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      projectName: project.projectName,
      cloneLink: project.cloneLink,
      authorizationPass: project.authorizationPass,
      frontendEnv: project.frontendEnv || '',
      backendEnv: project.backendEnv || ''
    });
    setShowModal(true);
    setShowPassword(false);
  };

  const openModal = () => {
    setEditingProject(null);
    setFormData({ projectName: '', cloneLink: '', authorizationPass: '', frontendEnv: '', backendEnv: '' });
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({ projectName: '', cloneLink: '', authorizationPass: '', frontendEnv: '', backendEnv: '' });
    setShowPassword(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleTablePassword = (projectId) => {
    setTablePasswords(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const getPasswordDisplay = (password) => {
    return '•'.repeat(password.length);
  };

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.cloneLink.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.authorizationPass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header Section */}
      <header className="header-section">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-container">
              <div className="logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="white" opacity="0.1"/>
                  <path d="M8 12L16 8L24 12L16 16L8 12Z" fill="white"/>
                  <path d="M8 20L16 16L24 20L16 24L8 20Z" fill="white" opacity="0.7"/>
                  <path d="M8 16L16 12L24 16L16 20L8 16Z" fill="white" opacity="0.85"/>
                </svg>
              </div>
              <div className="brand">
                <span className="brand-name">Vault</span>
                <span className="brand-subtitle">Credential Manager</span>
              </div>
            </div>
          </div>
          <div className="user-section">
            <div className="stat-item">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Add Section */}
      <section className="controls-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
        <button onClick={openModal} className="add-btn">
          Add Project
        </button>
      </section>

      {/* Table Card Section */}
      <section className="table-card-section">
        <div className="table-card">
          <div className="table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Clone Link</th>
                  <th>Authorization Pass</th>
                  <th>Frontend Env</th>
                  <th>Backend Env</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      {searchTerm ? 'No projects found matching your search.' : 'No projects yet. Click "Add Project" to create your first project!'}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map(project => (
                    <tr key={project._id}>
                      <td className="project-name">{project.projectName}</td>
                      <td className="clone-link">
                        <a href={project.cloneLink} target="_blank" rel="noopener noreferrer">
                          {project.cloneLink}
                        </a>
                      </td>
                      <td className="password-cell">
                        <div className="password-display">
                          <span className="password-text">
                            {tablePasswords[project._id] ? project.authorizationPass : getPasswordDisplay(project.authorizationPass)}
                          </span>
                          <button 
                            onClick={() => toggleTablePassword(project._id)}
                            className="eye-btn"
                            title={tablePasswords[project._id] ? "Hide password" : "Show password"}
                          >
                            {tablePasswords[project._id] ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                      </td>
                      <td className="env-cell">
                        {project.frontendEnv ? (
                          <button 
                            onClick={() => navigator.clipboard.writeText(project.frontendEnv)}
                            className="copy-btn"
                            title="Copy frontend environment variables"
                          >
                            📋 Copy Frontend
                          </button>
                        ) : (
                          <span className="no-env">No env available</span>
                        )}
                      </td>
                      <td className="env-cell">
                        {project.backendEnv ? (
                          <button 
                            onClick={() => navigator.clipboard.writeText(project.backendEnv)}
                            className="copy-btn"
                            title="Copy backend environment variables"
                          >
                            📋 Copy Backend
                          </button>
                        ) : (
                          <span className="no-env">No env available</span>
                        )}
                      </td>
                      <td className="actions">
                        <button 
                          onClick={() => handleEdit(project)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteProject(project._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={closeModal} className="close-btn">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cloneLink">Clone Link</label>
                <input
                  type="url"
                  id="cloneLink"
                  name="cloneLink"
                  value={formData.cloneLink}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="authorizationPass">Authorization Pass</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="authorizationPass"
                    name="authorizationPass"
                    value={formData.authorizationPass}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="eye-btn-input"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              
              <div className="env-section">
                <h3>Environment Variables</h3>
                <div className="env-fields">
                  <div className="form-group">
                    <label htmlFor="frontendEnv">Frontend Environment Variables</label>
                    <textarea
                      id="frontendEnv"
                      name="frontendEnv"
                      value={formData.frontendEnv}
                      onChange={handleChange}
                      placeholder="Enter frontend environment variables (one per line or KEY=VALUE format)"
                      rows="4"
                      className="env-textarea"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="backendEnv">Backend Environment Variables</label>
                    <textarea
                      id="backendEnv"
                      name="backendEnv"
                      value={formData.backendEnv}
                      onChange={handleChange}
                      placeholder="Enter backend environment variables (one per line or KEY=VALUE format)"
                      rows="4"
                      className="env-textarea"
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">Cancel</button>
                <button type="submit" className="submit-btn">
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
