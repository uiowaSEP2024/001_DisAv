import React from 'react';
import '../styles/dashboard.css';
import Preference from './Preference';
const Dashboard = () => {
  // Retrieve user information from session storage
  console.log('sessionStorage', sessionStorage);
  const user = JSON.parse(sessionStorage.getItem('user'));
  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      {user && (
        <div className="dashboard-content">
          <p>This is where your dashboard content will go.</p>
          {/* Display user information */}
          <p>Username: {user.username}</p>
          <p>First name: {user.firstname}</p>
          <p>Last name: {user.lastname}</p>
          <p>Email: {user.email}</p>

          {/* Add more user details as needed */}
        </div>
      )}
      {/* <Preference /> */}
    </div>
  );
};

export default Dashboard;
