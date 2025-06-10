import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import projectService from '../services/projectService'; // Ensure this path is correct

function CreateProjectModal({ open, onClose, onProjectCreated }) {
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError("Project name cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'))?.user; // Get logged-in user
      if (!user || !user.id) {
        throw new Error("User not logged in.");
      }

      await projectService.createProject(projectName, user.id);
      onProjectCreated(); // Callback to refresh project list in ProjectDashboard
      setProjectName(''); // Clear input
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          id="projectName"
          label="Project Name"
          type="text"
          fullWidth
          variant="outlined"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={loading || !projectName.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateProjectModal;