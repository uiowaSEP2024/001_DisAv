import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext'; // Import AuthContext
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';

const Login = () => {
  toast.configure();
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

      if (response.status === 200) {
        toast.success('Login successful');
        // Store the token in local storage
        localStorage.setItem('token', response.data.token);
        // Store user information in session storage
        // sessionStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // sessionStorage.setItem('username', response.data.user.username);
        localStorage.setItem('username', response.data.user.username); // sessionStorage does not persist when opening a new tab, and need to grab username values on task redirect
        localStorage.setItem('taskFrequency', response.data.user.taskFrequency); // sessionStorage does not persist when opening a new tab, and need to grab taskFrequency values on task redirect
        window.postMessage(
          {
            type: 'LOGIN_SUCCESS',
            token: localStorage.getItem('token'),
            user: localStorage.getItem('user'),
          },
          '*'
        );
        // Update the login state using the login function from AuthContext
        login(response.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response.status === 404) {
        // Handle HTTP errors here
        toast.error('User does not exist');
        console.error(err.response.data.message);
      } else if (err.response.status === 401) {
        // Handle HTTP errors here
        toast.error('Password incorrect');
        console.error(err.response.data.message);
      } else {
        // Handle other errors here
        console.error('Login failed. Please try again later.');
        toast.error('Login failed. Please try again later.');
      }
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
            required={true}
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
            required={true}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <input type="submit" value="Submit" data-testid="submit-button" />
      </form>
    </div>
  );
};

export default Login;
