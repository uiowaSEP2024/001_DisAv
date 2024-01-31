import React from 'react';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Logo</div>
      <div className="buttons">
        <button>Log In</button>
        <button>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
