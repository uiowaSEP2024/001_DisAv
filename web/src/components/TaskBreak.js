import React from 'react';
import '../styles/tasks.css';

// Import all your video files
import fireBreak from '../assets/fire.mp4';
import coffeeBreak from '../assets/coffee.mp4';

// Create an array of video sources
const videos = [fireBreak, coffeeBreak];

const TaskBreak = () => {
  // Select a random video from the array
  const randomVideo = videos[Math.floor(Math.random() * videos.length)];

  return (
    <div className="break-time-container">
      <h2>Break Time</h2>
      <p>Read a book, exercise or wait out timer to continue browsing</p>
      <video autoPlay loop muted className="break-time-video">
        <source src={randomVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default TaskBreak;
