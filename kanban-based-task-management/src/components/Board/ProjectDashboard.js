// src/components/Board/ProjectDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService'; // Adjust path if necessary
import CreateProjectModal from './CreateProjectModal'; // <-- Import the modal
import {
  Box,
  Button,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Grid 
} from '@mui/material';


function ProjectDashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();

  const fetchUserProjects = async (id) => {
    try {
        setLoading(true);
        const response = await projectService.getProjectsByOwner(id);
        
        console.log('Full Axios response object:', response);
        console.log('Backend response data (from ServerResponse):', response.data);
        console.log('Actual projects array:', response.data.data); 

        
        if (response.data && Array.isArray(response.data)) {
            setProjects(response.data); // Access the nested 'data' property
        } else {
            console.warn("Expected an array of projects but received:", response.data);
            setProjects([]); // Set to empty array to prevent map error
        }
    } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.response?.data?.message || 'Failed to load projects.');
        setProjects([]); // Ensure projects is an array on error as well
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('storedUser=',storedUser)
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('parsedUser=',parsedUser);
        setUser(parsedUser.user);
        fetchUserProjects(parsedUser.user.id);
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        setError("Failed to load user session. Please log in again.");
        setLoading(false);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleProjectCreated = () => {
    // Re-fetch projects after a new one is created
    if (user && user.id) {
      fetchUserProjects(user.id);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/login')} sx={{ mt: 2 }}>Back to Login</Button>
      </Container>
    );
  }

  return (
    <Container component="main" sx={{ mt: 4 }}>
      {projects.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            You don't have any projects yet!
          </Typography>
          <Button variant="contained" onClick={handleOpenModal} sx={{ mt: 2 }}>
            Create Your First Project
          </Button>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4">
              Your Projects
            </Typography>
            <Button variant="contained" onClick={handleOpenModal}>
              Add New Project
            </Button>
          </Box>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>{project.name}</Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/project/${project.id}`)} // Link to detailed project view
                  >
                    View Board
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Render the CreateProjectModal */}
      <CreateProjectModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onProjectCreated={handleProjectCreated}
      />
    </Container>
  );
}

export default ProjectDashboard;