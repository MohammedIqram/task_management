// services/projectService.js
import axios from 'axios';

const API_URL = 'http://localhost:8081/v1'; 

const getProjectsByOwner = (id) => {

  return axios.get(`${API_URL}/project/${id}`);
};

const createProject = (name, ownerId) => {
  return axios.post(`${API_URL}/project/add`, { name, owner_id: ownerId });
};


const projectService = {
  getProjectsByOwner,
  createProject,
};

export default projectService;