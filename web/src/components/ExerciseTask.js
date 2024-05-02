import React from 'react';
import SubNavbar from './SubNavbar';
import '../styles/exercisetask.css';
function ExerciseTask(props) {
  return (
    <div>
      <SubNavbar />
      <br />
      <div className='container'>
        <h2> To unblock browsing with exercise, use mobile app</h2>
      </div>
    </div>
  );
}

export default ExerciseTask;
