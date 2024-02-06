import React from 'react';
import '../styles/navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Logo</div>
      <div className="buttons">
        <Link to="/login">
          <button>Log In</button>
        </Link>
        <button>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
