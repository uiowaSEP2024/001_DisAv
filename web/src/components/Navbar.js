import React from 'react';
import '../styles/navbar.css';
import { Link } from 'react-router-dom';
import LogoImage from '../assets/logo.png';

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar" data-testid="navbar">
      <div className="buttons">
        <Link to="/">
          <button>Infinite Focus</button>
        </Link>
      </div>

      <div className="buttons">
        {isLoggedIn ? (
          <>
            <Link to="/rewards">
              <button>Rewards</button>
            </Link>
            <Link to="/preference">
              <button>Preferences</button>
            </Link>
            <Link to="/tasks">
              <button>Tasks</button>
            </Link>
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
