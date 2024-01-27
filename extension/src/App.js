import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentUrl, setCurrentUrl] = useState('');

  // Function to get the current tab URL
  const getCurrentTabUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];
      setCurrentUrl(tab.url);
    });
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>Chrome Extension with React</h1>
          <button onClick={getCurrentTabUrl}>Get Current URL</button>
          <p>Current URL: {currentUrl}</p>
        </header>
      </div>
  );
}

export default App;
