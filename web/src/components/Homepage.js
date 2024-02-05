import React from 'react';
import '../styles/homepage.css';
import Navbar from './Navbar';

const Homepage = () => {
  return (
    <div className="homepage" data-testid="homepage">
      <Navbar />
      {/* Rest of the homepage content */}
    </div>
  );
};

export default Homepage;
