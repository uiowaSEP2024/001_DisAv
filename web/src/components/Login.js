import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';

const Login = () => {
  toast.configure();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3002/auth/login', {
        username: username,
        password: password,
      })
        .then(response => {
          if (response.data.message === 'Invalid username or password') {
            toast.error('Invalid username or password');
            return;
          }
          else {
            toast.success('Login successful');
            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);
            // Store user information in session storage
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard', { state: { user: response.data.user } });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
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
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
