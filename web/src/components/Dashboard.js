import React from 'react';
import '../styles/dashboard.css';
import Preference from './Preference';
const Dashboard = () => {
  // Retrieve user information from session storage
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
          <div className="task-cards">
            {user.preferredTasks && user.preferredTasks.map((task, index) => (
              <div key={index} className="task-card">
                {task}
              </div>
            ))}
          </div>
          {/* Add more user details as needed */}
        </div>
      )}
      <Preference />
    </div>
  );
};

export default Dashboard;
