// Tasks.js
import React, { useState, useEffect } from 'react';
import TaskBreak from './TaskBreak'; // Import the break task component
import '../styles/tasks.css';

const Tasks = () => {
  const [timer, setTimer] = useState(10); // 10 seconds for demo purposes
  const [currentTask, setCurrentTask] = useState('break'); // Default task type

  useEffect(() => {
    // Start the timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        }
        clearInterval(interval);
        return 0;
      });
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

// Logic to skip the task
  const skipTask = () => {
    setTimer(0);
  };

  const renderTask = () => {
    switch (currentTask) {
      case 'break':
        return <TaskBreak />;
      // case 'task1': return <Task1 />;
      // case 'task2': return <Task2 />;
      // case 'task3': return <Task3 />;
      default:
        return <div>Unknown task</div>;
    }
  };

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
          <div>Task completed!</div>
        )}
        <button onClick={skipTask} disabled={timer <= 0}>Skip</button>
      </div>
    </>
  );
};

export default Tasks;
