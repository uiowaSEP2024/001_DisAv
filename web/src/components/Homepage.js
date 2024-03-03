import React from 'react';
import '../styles/homepage.css';
// import Navbar from './Navbar';

const Homepage = () => {
  axios.get('http://localhost:3002/task/get-by-username', {username: "JoslinSome"})
    .then(r=>console.log("Hello"))
  return (
    <div className="homepage" data-testid="homepage">
      {/* Rest of the homepage content */}
    </div>
  );
};

export default Homepage;
