import React, { useState, useEffect } from 'react';
import TaskBreak from './TaskBreak';
import '../styles/tasks.css';
import confetti from 'canvas-confetti';
import axios from 'axios';
import SubNavbar from './SubNavbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

const Tasks = ({ assignedTask }) => {
  const [timer, setTimer] = useState(300); // Timer initially set to 300 seconds (5 minutes)
  const [currentTask, setCurrentTask] = useState('break');
  const [maxTime, setMaxTime] = useState(300);
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
          if (prevTimer > 1) return prevTimer - 1 ;
          clearInterval(interval);
          updateTask('break', true);
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
  async function updateTask(type, isCompleted) {
    await axios
      .get('http://localhost:3002/task/get-most-recent-task', {
        params: { username: localStorage.getItem('username') },
      })
      .then(r => {
        axios
          .put('http://localhost:3002/task/update', {
            id: r.data.task._id,
            type: type,
            isCompleted: isCompleted,
            username: localStorage.getItem('username'),
          })
          .catch(e => console.log('Error here', e));
      })
      .catch(e => console.log('ERROR', e));
  }
  const skipTask = () => {
    setTimer(0); // Stops the timer
    updateTask('break', false);
    completeTask(); // Marks the task as completed and triggers confetti
  };

  const formatTime = time => {
    const totalSeconds = Math.abs(Math.round(time));  // Use Math.abs to handle negative values gracefully
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
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
          <Box sx={{ width: '100%', mr: 1, height: '20px', 'span': { height: '100%' } }}>
            <LinearProgress
              variant="determinate"
              value={(1 - (new Date(user.frozenUntil).getTime() - (new Date().getTime()))/1000 / maxTime) * 100}
              sx={{
                height: 20, // Make the progress bar thicker
                backgroundColor: '#e0e0e0', // Light grey color for the background
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'linear-gradient(to right, #66bb6a, #43a047)', // Custom gradient
                }
              }}
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <h2>{}</h2>
            <Typography variant="body2" color="text.secondary">{formatTime((new Date(user.frozenUntil).getTime() - (new Date().getTime()))/1000)}</Typography>
          </Box>
          <button onClick={skipTask}> Skip</button>
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
