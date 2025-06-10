import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Board from './components/Board/Board'; // Keep importing your Board component
import ProjectDashboard from './components/Board/ProjectDashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/board"
            element={isAuthenticated() ? <ProjectDashboard /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/project/:projectId"
            element={isAuthenticated() ? <Board /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/board" replace /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;