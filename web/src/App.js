// App.js
import React, { useContext } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Preference from './components/Preference';
import Rewards from './components/Rewards';
import Tasks from './components/Tasks';
import Navbar from './components/Navbar';
import ReadTask from './components/ReadTask';

function App() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    console.log('Logged out successfully');
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Apply the ProtectedRoute wrapper to each protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preference"
          element={
            <ProtectedRoute>
              <Preference />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <Rewards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/break-task"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/read-task"
          element={
            <ProtectedRoute>
              <ReadTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
