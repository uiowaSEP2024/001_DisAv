import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CountdownTimer = ({ totalTime, timeLeft }) => {
  const [remainingTime, setRemainingTime] = useState(timeLeft ? timeLeft : 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => Math.max(0, prevTime - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const formatTime = time => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    if (hours === 0) {
      if (minutes === 0) {
        return `${seconds.toString().padStart(2, '0')}`;
      }
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
    <div className="countdown-timer">
      <h3 style={{ color: 'white' }}> Next task in:</h3>
      <div style={{ width: '300px', height: '300px' }}>
        <CircularProgressbar
          value={remainingTime && totalTime ? (remainingTime / totalTime) * 100 : 0}
          text={remainingTime ? formatTime(remainingTime) : formatTime(0)}
          styles={buildStyles({
            textColor: '#fff',
            pathColor: '#007bff',
            trailColor: '#d6d6d6',
            pathRadius: '5%',
            trailWidth: 5,
          })}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;
