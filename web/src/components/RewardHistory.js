import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/rewards.css'; // Path to your CSS file

const RewardHistory = ({ setTotalPoints }) => {
  const [userTasks, setUserTasks] = useState([]);
  const fetchUserTasks = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const username = sessionStorage.getItem('username') || user.username; // Use the username from session storage or local storage
      const response = await axios.get('https://distraction-avoider-bcd786e690c7.herokuapp.com/task/get-by-username', {
        params: { username },
      });
      console.log(response.data.tasks, username);
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
      setUserTasks(formattedTasks.reverse());
      let totalPoints = formattedTasks.reduce(
        (total, task) => (task.isCompleted ? total + task.points : total - 5),
        0
      );
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
        <div
          key={index}
          className={task.isCompleted ? 'history-item completed' : 'history-item not-completed'}
        >
          {task.isCompleted ? (
            <p>
              Completed: {task.taskType} on {task.date}: Earned {task.points} points
            </p>
          ) : (
            <p>
              Skipped: {task.taskType} on {task.date}: lost 5 points
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default RewardHistory;
