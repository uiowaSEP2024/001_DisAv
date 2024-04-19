import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import BoxComponent from './BoxComponent';
import DialogBox from './DialogBox';
import axios from 'axios';
import Preference from './Preference';
import UserInfo from './UserInfo';
const Dashboard = () => {
  const [isBlacklistDialogVisible, setBlacklistDialogVisible] = useState(false);
  const [isWhitelistDialogVisible, setWhitelistDialogVisible] = useState(false);
  const [trackedSites, setTrackedSites] = useState([]);
  const [whitelistedSites, setWhitelistedSites] = useState([]);

  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    axios.get(`http://localhost:3002/user/get-by-username?username=${user.username}`).then(res => {
      setTrackedSites(res.data.user.blacklistedWebsites);
      setWhitelistedSites(res.data.user.whitelistedWebsites || []);
    });
  }, [isBlacklistDialogVisible, isWhitelistDialogVisible]);

  function addSite(text, listType) {
    const updatedSites =
      listType === 'blacklist' ? [...trackedSites, text] : [...whitelistedSites, text];
    axios
      .put('http://localhost:3002/user/update-all-preferences', {
        username: user.username,
        blacklistedWebsites: listType === 'blacklist' ? updatedSites : trackedSites,
        whitelistedWebsites: listType === 'whitelist' ? updatedSites : whitelistedSites,
      })
      .then(response => {
        console.log('Preferences updated:', response.data);
        if (listType === 'blacklist') {
          setTrackedSites(updatedSites);
        } else {
          setWhitelistedSites(updatedSites);
        }
      })
      .catch(error => {
        console.error('Failed to update preferences:', error);
      });
  }

  function removeSite(index, listType) {
    const newSites =
      listType === 'blacklist'
        ? trackedSites.filter((_, i) => i !== index)
        : whitelistedSites.filter((_, i) => i !== index);
    axios
      .put('http://localhost:3002/user/update-all-preferences', {
        username: user.username,
        blacklistedWebsites: listType === 'blacklist' ? newSites : trackedSites,
        whitelistedWebsites: listType === 'whitelist' ? newSites : whitelistedSites,
      })
      .then(response => {
        console.log('Preferences updated:', response.data);
        if (listType === 'blacklist') {
          setTrackedSites(newSites);
        } else {
          setWhitelistedSites(newSites);
        }
      })
      .catch(error => {
        console.error('Failed to update preferences:', error);
      });
  }

  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      {user && (
        <div className="dashboard-content">
          <p>Hi, {user.firstname}</p>
          {/* Display user information */}
          <p>These sites are currently being monitored for doom scrolling:</p>
        </div>
      )}
      <div className="lists-container">
        <div className="blacklist-container">
          <h2>Blacklisted Sites</h2>
          <BoxComponent content={trackedSites} onRemove={index => removeSite(index, 'blacklist')} />
          <br />
          <button className="btn-add-website" onClick={() => setBlacklistDialogVisible(true)}>
            Add Blacklisted Site
          </button>
        </div>
        <div className="whitelist-container">
          <h2>Whitelisted Sites</h2>
          <BoxComponent
            content={whitelistedSites}
            onRemove={index => removeSite(index, 'whitelist')}
          />
          <br />
          <button className="btn-add-website" onClick={() => setWhitelistDialogVisible(true)}>
            Add Whitelisted Site
          </button>
        </div>
      </div>
      {isBlacklistDialogVisible && (
        <DialogBox
          isOpen={isBlacklistDialogVisible}
          onClose={() => setBlacklistDialogVisible(false)}
          onSave={text => addSite(text, 'blacklist')}
          title="Site to Blacklist"
          dashboard={true}
        />
      )}
      {isWhitelistDialogVisible && (
        <DialogBox
          isOpen={isWhitelistDialogVisible}
          onClose={() => setWhitelistDialogVisible(false)}
          onSave={text => addSite(text, 'whitelist')}
          title="Site to Whitelist"
          dashboard={true}
        />
      )}
      <br />
      <UserInfo user={user} />
      <br />
      <Preference />
    </div>
  );
};

export default Dashboard;
