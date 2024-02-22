import React from 'react';
import '../styles/navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar" data-testid="navbar">
      <div className="logo">Logo</div>
      <div className="buttons">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">
              <button>Dashboard</button>
            </Link>
            <button onClick={onLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>Log In</button>
            </Link>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
