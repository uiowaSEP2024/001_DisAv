import React from 'react';
import '../styles/boxcomponent.css';

function BoxComponent({ content, onRemove }) {
  if (content && content.length > 0) {
    return (
      <div className="box">
        <ul>
          {content.map((site, index) => (
            <li key={index}>
              <span className="siteName">{site}</span>
              <button className="removeButton" onClick={() => onRemove(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="box">
        <p>No sites are currently being tracked.</p>
      </div>
    );
  }
}

export default BoxComponent;
