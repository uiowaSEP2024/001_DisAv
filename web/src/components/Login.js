import React from 'react';
import '../styles/login.css';

const Login = () => {
  return (
    <div className="login">
      <form data-testid="login-form">
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
