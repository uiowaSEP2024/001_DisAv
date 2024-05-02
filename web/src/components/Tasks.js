import React, { useState, useEffect } from 'react';
import TaskBreak from './TaskBreak';
import '../styles/tasks.css';
import confetti from 'canvas-confetti';
import axios from 'axios';
import SubNavbar from './SubNavbar';

const Tasks = ({ assignedTask }) => {
  const [timer, setTimer] = useState(300); // Timer initially set to 300 seconds (5 minutes)
  const [currentTask, setCurrentTask] = useState('break');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get('http://localhost:3002/user/get-by-username', {
        params: { username: localStorage.getItem('username') },
      });
      setUser(response.data.user);
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (timer > 0 && !taskCompleted) {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 1) return prevTimer - 1;
          clearInterval(interval);
          completeTask();
          return 0;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, taskCompleted]);

  const completeTask = async () => {
    if (user) {
      user.frozenBrowsing = false;
      sessionStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user));
      await endFrozenBrowsing();
      setTaskCompleted(true);
    }
    triggerConfetti();
  };

  const endFrozenBrowsing = async () => {
    const currentDate = new Date();
    await axios
      .put('http://localhost:3002/user/update-frozen-browsing', {
        username: localStorage.getItem('username'),
        frozenBrowsing: false,
        nextFrozen: new Date(currentDate.getTime() + localStorage.getItem('taskFrequency')),
      })
      .then(response => {
        sessionStorage.setItem('user', JSON.stringify(response.data.user)); // Update current stored user
        console.log('Success', response.data.user);
        window.postMessage(
          {
            type: 'LOGIN_SUCCESS',
            token: localStorage.getItem('token'),
            user: sessionStorage.getItem('user'),
          },
          '*'
        );
        // user.frozenBrowsing = false
        console.log('Success', user);
      })
      .catch(error => {
        console.log('Unexpected error', error);
      });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 1000,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  const skipTask = () => {
    setTimer(0); // Stops the timer
    completeTask(); // Marks the task as completed and triggers confetti
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (taskCompleted) {
    return (
      <>
        <SubNavbar />
        <div className="task-container">
          <h1>Browsing is not frozen</h1>
          <h2>No required tasks at this time</h2>
        </div>
      </>
    );
  }

  if (user?.frozenBrowsing && currentTask === 'break') {
    return (
      <>
        <SubNavbar />
        <div className="task-container">
          <TaskBreak />
          <div>Time remaining: {formatTime(timer)}</div>
          <button onClick={skipTask} disabled={timer <= 0}>
            Skip
          </button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <SubNavbar />
        <div className="task-container">
          <h1>Browsing is not frozen</h1>
          <h2>No required tasks at this time</h2>
        </div>
      </>
    );
  }
};

export default Tasks;
