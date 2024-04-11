import React from 'react';
import SubNavbar from './SubNavbar';

function ExerciseTask(props) {
  return (
    <div>
      <SubNavbar />
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          maxWidth: '800px',
          padding: '20px',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto', // To center horizontally
          height: '100vh', // To center vertically
        }}
      >
        <h2> To unblock browsing with exercise, use mobile app</h2>
      </div>
    </div>
  );
}

export default ExerciseTask;
