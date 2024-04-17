import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import Preference from './Preference';
import BoxComponent from './BoxComponent';
import DialogBox from './DialogBox';
import axios from 'axios';
const Dashboard = () => {
  const [visible, setVisible] = useState(false);
  const [trackedSites, setTrackedSites] = useState([]);
  useEffect(() => {
    axios
      .get(
        `http://localhost:3002/user/get-by-username?username=${JSON.parse(sessionStorage.getItem('user')).username}`
      )
      .then(res => {
        setTrackedSites(res.data.user.blacklistedWebsites);
      });
  }, [visible]);

  function addSite(text) {
    setTrackedSites([...trackedSites, text]);
    axios.put('http://localhost:3002/user/update-all-preferences', {
      username: JSON.parse(sessionStorage.getItem('user')).username,
      blacklistedWebsites: trackedSites,
    });
  }
  // Retrieve user information from session storage
  console.log('sessionStorage', sessionStorage);
  const user = JSON.parse(sessionStorage.getItem('user'));
  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      {user && (
        <div className="dashboard-content">
          <p>Hi, {user.firstname}</p>
          {/* Display user information */}
          <p>These sites are currently being monitored for doom scrolling:</p>
          <BoxComponent content={trackedSites} />
          <button
            style={{
              backgroundColor: 'rgba(77,36,238,0.8)',
              color: '#fff',
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '80%',
            }}
            onClick={() => setVisible(true)}
          >
            Add Website
          </button>
          {/* Add more user details as needed */}
        </div>
      )}
      <DialogBox
        addSite={addSite}
        isOpen={visible}
        onClose={() => setVisible(false)}
        dashboard={true}
      />
      {/* <Preference /> */}
    </div>
  );
};

export default Dashboard;
