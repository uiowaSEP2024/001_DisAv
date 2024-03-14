import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/rewards.css'; // Path to your CSS file

const RewardHistory = ({ setTotalPoints }) => {
  const [userTasks, setUserTasks] = useState([]);
  const fetchUserTasks = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const username = user.username;
      const response = await axios.get('http://localhost:3002/task/get-by-username', {
        params: { username },
      });
      const formattedTasks = response.data.tasks.map(task => {
        const formattedDate = new Date(task.date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        return { ...task, date: formattedDate };
      });
      setUserTasks(formattedTasks);
      const totalPoints = formattedTasks.reduce((total, task) => total + task.points, 0);
      setTotalPoints(totalPoints);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  return (
    <div className="reward-history">
      {userTasks.map((task, index) => (
        <div key={index} className="history-item">
          <p>
            Completed: {task.taskType} on {task.date}: Earned {task.points} points
          </p>
        </div>
      ))}
    </div>
  );
};

export default RewardHistory;
