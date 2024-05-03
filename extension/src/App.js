import React, { useState, useEffect } from 'react';
import './App.css';
import { ExternalLink } from 'react-external-link';
import CountdownTimer from './components/CountdownTimer';
import axios from 'axios';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/logo.png';

export function timeDifference(timeToCompare) {
  // get the difference in milliseconds between the current time and the time timeToCompare
  let difference = new Date(timeToCompare).getTime() - new Date().getTime();
  console.log(new Date(timeToCompare).getTime(), 'timeToCompare');
  console.log(new Date().getTime(), 'new Date().getTime()');
  console.log(difference, 'difference');
  // calculate seconds difference
  return Math.floor(difference / 1000);
}
export function clearStorage(callback) {
  chrome.storage.local.clear(function () {
    let error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    } else {
      callback();
    }
  });
}
function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [monitoredSites, setMonitoredSites] = useState([]);
  const [visible, setVisible] = useState(false);
  const [blockedSite, setBlockedSite] = useState();
  const fetchUserInfo = () => {
    console.log('fetchUserInfo called');
    chrome.storage.local.get(['user', 'token'], async function (result) {
      if (result.user) {
        await axios
          .get('https://distraction-avoider-bcd786e690c7.herokuapp.com/user/get-by-username', {
            params: { username: result.user.username },
          })
          .then(response => {
            setUserInfo(response.data.user);
            setLoggedIn(true);
            setMonitoredSites(response.data.user.blacklistedWebsites);
            console.log('User info:', response.data);
          });
      }
      console.log('User info:', result.user);
    });
  };
  function BrowserStatus(props) {
    if (loggedIn && visible) {
      return (
        <div className="App">
          {/*<button onClick={clearStorage}>good Current URL</button>*/}
          <div>
            <h2 style={{ color: 'red' }}>Browsing detected on {blockedSite}</h2>
            <div className={'timer'}>
              <CountdownTimer
                totalTime={userInfo.taskFrequency / 1000}
                timeLeft={timeDifference(userInfo.nextFrozen)}
              />
            </div>
          </div>
        </div>
      );
    }
    else if(loggedIn){

    }
    else {
      return (
        <div style={{}}>
          <h2>Log in to use extension</h2>
        </div>
      );
    }
  }
  function Settings(props) {
    const [userStats, setUserStats] = useState({
      skippedTasks: 10,
      readBooks: 25,
      waited: 76,
      exercised: 0,
    });
    console.log('HEllo THERE', monitoredSites);
    if (!loggedIn) {
      return null;
    }

    const calculatePercentage = (value, total) => {
      return total > 0 ? (value / total) * 100 : 0;
    };

    const totalTasks = 100;
    const totalBooks = 50;

    return (
      <div className="App">
        <h1 className="settings-header">Settings</h1>
        <div className="monitored-sites-section">
          <h2>Monitored Sites</h2>
          <div className="monitored-sites-list">
            {monitoredSites.map((site, index) => (
              <div key={index} className="site-item">
                <span className="site-name">{site}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="user-stats">
          <h2>Stats</h2>
          <div className="stat-item">
            <label>Tasks Skipped</label>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${calculatePercentage(userStats.skippedTasks, totalTasks)}%` }}
              ></div>
            </div>
          </div>
          <div className="stat-item">
            <label>Books Read</label>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${calculatePercentage(userStats.readBooks, totalBooks)}%` }}
              ></div>
            </div>
          </div>
          {/* Add more stats with progress bars as needed */}
        </div>
      </div>
    );
  }
  const clearStorage = () => {
    chrome.storage.local.clear(function () {
      let error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      } else {
        setLoggedIn(false);
        setUserInfo({});
        console.log('Storage cleared successfully.');
      }
    });
  };
  console.log('HELLO THERE I AM STARTING');
  // Use useEffect to fetch user info when the component mounts
  useEffect(() => {
    console.log('testing');
    fetchUserInfo();
    const checkVisibleVariable = () => {
      // Continuously check Chrome storage for the "visible" variable
      chrome.storage.local.get(['visible'], function (result) {
        if (result.visible) {
          console.log('Website is blocked. Continue workflow...');
          setVisible(true);
        } else {
          console.log('Website is not blocked. Waiting...');
          setVisible(false);
        }
      });
      chrome.storage.local.get(['site'], function (result) {
        if (result.site) {
          console.log('Website is blocked. Continue workflow...');
          setBlockedSite(result.site);
        }
      });
    };

    // Check the "visible" variable initially
    checkVisibleVariable();

    // Set interval to continuously check the "visible" variable
    const interval = setInterval(checkVisibleVariable, 1000); // Check every 5 seconds

    // Clean up function to clear interval when component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to get the current tab URL
  // const getCurrentTabUrl = () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     const tab = tabs[0];
  //     setCurrentUrl(tab.url);
  //   });
  // };
  if (loggedIn) {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            {/* Logo or App Name */}
            <div className="App-logo">
              {/* Your logo here */}
              <Link to="/">
                <img src={logo} className={'logo'} />
              </Link>
            </div>
            {/* Navigation */}
            <nav className="App-nav">
              <ul>
                <li>
                  <Link to="/">Status</Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <Link onClick={clearStorage} to="/browser-status">
                    Logout
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
          {/* Routes for displaying content */}
          <Routes>
            <Route path="/" element={<BrowserStatus />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          {/* Main Content */}
          <main className="App-content">{/* The content will be rendered by React Router */}</main>
        </div>
      </Router>
    );
  } else {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            {/* Logo or App Name */}
            <div className="App-logo">
              <Link to="/">
                <img src={logo} className={'logo'} />
              </Link>
            </div>
            {/* Navigation */}
            <nav className="App-nav">
              <ul>
                <ExternalLink href={'https://infinitefocus.tech/'}>
                  <button>Sign in</button>
                </ExternalLink>{' '}
              </ul>
            </nav>
          </header>
          {/* Routes for displaying content */}
          <Routes>
            <Route path="/" element={<BrowserStatus />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          {/* Main Content */}
          <main className="App-content">{/* The content will be rendered by React Router */}</main>
        </div>
      </Router>
    );
  }
}

export default App;
