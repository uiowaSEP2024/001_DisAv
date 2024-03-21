import React, { useState, useEffect } from 'react';
import TaskBreak from './TaskBreak'; // Import the break task component
import '../styles/tasks.css';
import confetti from 'canvas-confetti';
import axios from 'axios'; // Import the confetti library

const Tasks = ({ assignedTask }) => {
  const [timer, setTimer] = useState(10); // 10 seconds for demo purposes
  const [currentTask, setCurrentTask] = useState('break'); // Default task type
  const [taskCompleted, setTaskCompleted] = useState(false); // State to track task completion
  const [tasks, setTasks] = useState(null);
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
        console.log('Success', response.data.user);
      })
      .catch(error => {
        console.log('Unexpected error', error);
      });
  };
  // get tasks by username
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3002/task/get-by-username', {
        params: { username: sessionStorage.getItem('username') },
      });
      response.data.tasks.length>0? setTasks(response.data.tasks): setTasks(null)
      console.log("tasks",response.data.tasks)
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  }
  useEffect(() => {
    if (assignedTask) {
      setCurrentTask(assignedTask);
    }
  }, [assignedTask]); // Only re-run the effect if assignedTask changes
  fetchTasks().then(r => null);
  useEffect(() => {
    if (timer > 0) {
      setTaskCompleted(false); // Reset task completion state with each new timer
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            clearInterval(interval);
            // Trigger confetti when the timer reaches 1 so it explodes right as the timer hits 0
            triggerConfetti();
            endFrozenBrowsing().then(r => console.log('Browsing updated'));
            return 0;
          }
        });
      }, 1000);
      // endFrozenBrowsing().then(r => console.log("Browsing updated"))
      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }
  }, [timer]);

  const triggerConfetti = () => {
    setTaskCompleted(true); // Mark the task as completed
    confetti({
      particleCount: 1000,
      spread: 100,
      origin: { y: 0.6 }, // Make confetti come from the top
    });
    setTimeout(() => setTaskCompleted(false), 3000); // Hide confetti after 3 seconds
  };

  const skipTask = () => {
    setTimer(0);
    triggerConfetti();
  };

  const renderTask = () => {
    switch (currentTask) {
      case 'break':
        return <TaskBreak />;
      case 'work':
        return <div>Work task</div>;
      case 'exercise':
        return <div>Exercise task</div>;
      case 'reading':
        return <div>Reading task</div>;
    }
  };
  if(tasks){
    return (
      <>
        <div className={`overlay ${timer > 0 ? 'active' : ''}`}></div>
        <div className="task-container">
          {timer > 0 ? (
            <>
              <div>{renderTask()}</div>
              <div>Time remaining: {timer} seconds</div>
            </>
          ) : (
            <>
              <div>Task completed!</div>
              {taskCompleted && <div className="confetti">🎉</div>}
            </>
          )}
          <button onClick={skipTask} disabled={timer <= 0}>
            Skip
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="task-container">
      <h1>No tasks at this time</h1>
    </div>
  );


};

export default Tasks;
