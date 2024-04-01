import React from 'react';
import '../styles/navbar.css';
import { Link } from 'react-router-dom';
import LogoImage from '../assets/logo.png';

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar" data-testid="navbar">
      <div className="tabs">
        <div className="buttons">
          <Link to="/" className="link-style">
              <h4>Infinite Focus</h4>
          </Link>
        </div>

        <div className="buttons">
          {isLoggedIn ? (
            <>
              <Link to="/rewards" className="link-style"><h4>Rewards</h4></Link>
              <Link to="/preference" className="link-style"><h4>Preferences</h4></Link>
              <Link to="/break-task" className="link-style"><h4>Tasks</h4></Link>
              <Link to="/dashboard" className="link-style">
                <h4>Dashboard</h4>
              </Link>
              <Link to="/" className="link-style">
                <h4 onClick={onLogout}>Log Out</h4>
              </Link>

            </>
          ) : (
            <>
              <Link to="/login" className="link-style">
                <h4>Log In</h4>
              </Link>
              <Link to="/signup" className="link-style">
                <h4>Sign Up</h4>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;