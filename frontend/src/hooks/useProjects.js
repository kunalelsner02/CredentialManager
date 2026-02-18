import { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';

export const useProjects = (token) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectsAPI.getAll(token);
        console.log("🚀 ~ fetchProjects ~ response:", response);
        
        if (Array.isArray(response)) {
          setProjects(response);
        } else {
          setError(response.error || 'Error fetching projects');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  const createProject = async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsAPI.create(token, projectData);
      console.log("🚀 ~ createProject ~ response:", response);
      
      if (response._id || response.projectName) {
        setProjects(prev => [...prev, response]);
        return { success: true, data: response };
      } else {
        setError(response.error || 'Error creating project');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsAPI.update(token, id, projectData);
      console.log("🚀 ~ updateProject ~ response:", response);
      
      if (response._id || response.projectName) {
        setProjects(prev => 
          prev.map(project => 
            project._id === id ? response : project
          )
        );
        return { success: true, data: response };
      } else {
        setError(response.error || 'Error updating project');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsAPI.delete(token, id);
      console.log("🚀 ~ deleteProject ~ response:", response);
      
      if (response.message === 'Project deleted successfully' || response.status === 200) {
        setProjects(prev => prev.filter(project => project._id !== id));
        return { success: true };
      } else {
        setError(response.error || 'Error deleting project');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject
  };
};
