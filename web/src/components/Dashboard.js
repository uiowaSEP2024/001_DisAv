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
    axios.get(`https://distraction-avoider-bcd786e690c7.herokuapp.com/user/get-by-username?username=${user.username}`).then(res => {
      setTrackedSites(res.data.user.blacklistedWebsites);
      setWhitelistedSites(res.data.user.whitelistedWebsites || []);
    });
  }, [isBlacklistDialogVisible, isWhitelistDialogVisible]);

  function addSite(text, listType) {
    const updatedSites =
      listType === 'blacklist' ? [...trackedSites, text] : [...whitelistedSites, text];
    axios
      .put('https://distraction-avoider-bcd786e690c7.herokuapp.com/user/update-all-preferences', {
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
      .put('https://distraction-avoider-bcd786e690c7.herokuapp.com/user/update-all-preferences', {
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
      <h1>Welcome to Your Dashboard, {user ? user.firstname : 'User'}!</h1>
      <div className="grid-container">
        <div className="list-panel">
          <div className="blacklist-container">
            <h2>Blacklisted Sites</h2>
            <BoxComponent
              content={trackedSites}
              onRemove={index => removeSite(index, 'blacklist')}
            />
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
            <button className="btn-add-website" onClick={() => setWhitelistDialogVisible(true)}>
              Add Whitelisted Site
            </button>
          </div>
        </div>
        <div className="user-info-panel">
          <UserInfo user={user} />
        </div>
        <div className="preference-panel">
          <Preference />
        </div>
        {/* <div className="extra-panel">
          <p>Additional Tools or Stats</p>
        </div> */}
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
    </div>
  );
};

export default Dashboard;
