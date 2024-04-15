import React, { useState } from 'react';

function BoxComponent({ content }) {
  const [blockedSites, setblockedSites] = useState(content);
  if (content && content.length > 0) {
    return (
      <div
        className="box"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderRadius: 10,
          margin: 20,
          backgroundColor: 'rgba(126,102,222,0.8)',
          color: '#fff',
          elevation: 40,
          borderColor: '#ff0000',
        }}
      >
        <ul>
          {content.map(site => (
            <li key={site}>{site}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          margin: 20,
          backgroundColor: 'rgba(126,102,222,0.8)',
          color: '#fff',
          elevation: 40,
          borderColor: '#ff0000',
        }}
      >
        <p>No sites are currently being tracked.</p>
      </div>
    );
  }
}

export default BoxComponent;
