import axios from 'axios';

const API_URL = 'http://localhost:8081/v1';

const login = (email, password) => {
  return axios.post(API_URL + '/users/login', {
    email,
    password,
  });
};

// --- Add this register function ---
const register = (username, email, password) => {
  return axios.post(API_URL + '/users/add', { // This maps to your addUser controller
    username,
    email,
    password,
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  login,
  register, // Add register here
  logout,
};

export default authService;

