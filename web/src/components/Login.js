import React from 'react';
import '../styles/login.css';

const Login = () => {
  return (
    <div className="login">
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
