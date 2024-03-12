import React, { useState, useEffect } from 'react';
import './App.css';
import { ExternalLink } from 'react-external-link';
import CountdownTimer from './components/CountdownTimer';
function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const fetchUserInfo = () => {
    console.log('fetchUserInfo called');
    chrome.storage.local.get(['user', 'token'], function (result) {
      console.log('HERE');
      if (result.user) {
        console.log('There');
        setUserInfo(result.user);
        setLoggedIn(true);
      }
    });
  };
  const timeDifference = (timeToCompare)  => {
   // get the difference in milliseconds between the current time and the time timeToCompare
    let difference = new Date().getTime() - new Date(timeToCompare).getTime();
    // calculate seconds difference
    return Math.floor(difference / 1000);
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
  console.log('First');
  // Use useEffect to fetch user info when the component mounts
  useEffect(() => {
    console.log('testing');
    fetchUserInfo();
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to get the current tab URL
  // const getCurrentTabUrl = () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     const tab = tabs[0];
  //     setCurrentUrl(tab.url);
  //   });
  // };
  if(loggedIn){
    return (
      <div className="App">
        <h1>Infinite focus {new Date(userInfo.createdAt).toLocaleString()}tv {timeDifference(userInfo.nextFrozen)}</h1>
        {/*<button onClick={clearStorage}>good Current URL</button>*/}
          userInfo.lastFrozen?  (
        {null}
          ):(
        <div>
          <div className={'timer'}>
            <CountdownTimer totalTime={userInfo.taskFrequency / 1000} />
          </div>
          <button onClick={clearStorage}>Log out</button>
        </div>
        )
      </div>
    );
  }
  else{
    return (
      <div className="App">
        <h1>Infinite focus {new Date(userInfo.createdAt).toLocaleString()}</h1>
        {/*<button onClick={clearStorage}>good Current URL</button>*/}
        <ExternalLink href={'http://localhost:3000/login'}>
          <button>Log in</button>
        </ExternalLink>
      </div>
    );
  }
}

export default App;
