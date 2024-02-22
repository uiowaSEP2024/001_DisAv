import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Import AuthContext
import '../styles/login.css';

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use the login function from AuthContext

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/auth/login', {
        username: username,
        password: password,
      });

      if (response.data.message === 'Invalid username or password') {
        console.log('Invalid username or password');
      } else {
        console.log('Login successful');
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        // Update the login state using the login function from AuthContext
        login(response.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response) {
        // Handle HTTP errors here
        console.error(err.response.data.message);
      } else {
        // Handle other errors here
        console.error('Login failed. Please try again later.');
      }
      console.error(err);
    }
  };

  return (
    <div className="login">
      <form data-testid="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <input type="submit" value="Submit" data-testid="submit-button" />
      </form>
    </div>
  );
};

export default Login;
