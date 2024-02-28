// Preference.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/preference.css';

const defaultTasks = {
  Work: false,
  Reading: false,
  Exercise: false,
  Break: false,
};

const Preference = ({ initialPreferredTasks = defaultTasks, onClose = () => { } }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [preferredTasks, setPreferences] = useState(initialPreferredTasks); // Initialize as empty object
  const [taskFrequency, setTaskFrequency] = useState(':'); // Initialize task frequency
  const [workPreferences, setWorkPreferences] = useState('');
  const [readingPreferences, setReadingPreferences] = useState('');
  useEffect(() => {
    // Load the user's preferences when the component mounts
    if (user && user.preferredTasks) {
      setPreferences(user.preferredTasks);
      // Fetch preferredTasks from the database for new user
    }
    if (user && !user.preferredTasks) {
      setPreferences(defaultTasks);
    }
    if (user && user.taskFrequency) {
      const hours = Math.floor(user.taskFrequency / 3600000);
      const minutes = Math.floor((user.taskFrequency % 3600000) / 60000);
      const formattedFrequency = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      setTaskFrequency(formattedFrequency); // Set task frequency from user data
    }
  }, [user]);

  const handleToggle = preference => {
    const updatedPreferences = {
      ...preferredTasks,
      [preference]: preferredTasks[preference] === true ? false : true, // Toggle the value
    };

    setPreferences(updatedPreferences);
  };

  const handleSubmit = () => {
    // Update the user's prefferred tasks in the database
    axios
      .put('http://localhost:3002/user/update-preferred-tasks', {
        username: user.username,
        preferredTasks: preferredTasks,
      })
      .then(response => {
        // Update user data in sessionStorage with new preferences
        sessionStorage.setItem(
          'user',
          JSON.stringify({ ...user, preferredTasks: preferredTasks, taskFrequency: taskFrequency })
        );
        setUser({ ...user, preferredTasks: preferredTasks, taskFrequency: taskFrequency });
        onClose(); // Close the pop-up after submitting preferences
      })
      .catch(error => {
        console.error('Failed to update preferences', error);
      });
    // Convert HH:mm to milliseconds
    const [hours, minutes] = taskFrequency.split(':').map(Number);
    const milliseconds = (hours * 60 * 60 + minutes * 60) * 1000;

    //Update the user's task frequency in the database
    axios
      .put('http://localhost:3002/user/update-task-frequency', {
        username: user.username,
        taskFrequency: milliseconds,
      })
      .then(response => {
        // Update user data in sessionStorage with new preferences
        sessionStorage.setItem('user', JSON.stringify({ ...user, taskFrequency: milliseconds }));
        setUser({ ...user, taskFrequency: milliseconds });
        onClose(); // Close the pop-up after submitting preferences
      })
      .catch(error => {
        console.error('Failed to update preferences', error);
      });

    // Update the user's work preferences in the database
    axios
      .put('http://localhost:3002/user/update-work-preferences', {
        username: user.username,
        workPreferences: workPreferences,
      })
      .then(response => {
        // Update user data in sessionStorage with new preferences
        sessionStorage.setItem('user', JSON.stringify({ ...user, workPreferences: workPreferences }));
        setUser({ ...user, workPreferences: workPreferences });
        onClose(); // Close the pop-up after submitting preferences
      })
      .catch(error => {
        console.error('Failed to update work preferences', error);
      });

    // Update the user's reading preferences in the database
    axios
      .put('http://localhost:3002/user/update-reading-preferences', {
        username: user.username,
        readingPreferences: readingPreferences,
      })
      .then(response => {
        // Update user data in sessionStorage with new preferences
        sessionStorage.setItem('user', JSON.stringify({ ...user, readingPreferences: readingPreferences }));
        setUser({ ...user, readingPreferences: readingPreferences });
        onClose(); // Close the pop-up after submitting preferences
      })
      .catch(error => {
        console.error('Failed to update reading preferences', error);
      });
  };

  return (
    <div className="preferences">
      <h2>User Preferences</h2>
      <ul>
        {Object.keys(preferredTasks).map(preference => (
          <li key={preference}>
            <div className="preference-item">
              <label htmlFor={preference}>
                {preference.charAt(0).toUpperCase() + preference.slice(1)}
              </label>{' '}
              <label className="switch">
                <input
                  id={preference}
                  type="checkbox"
                  checked={preferredTasks[preference] === true}
                  onChange={() => handleToggle(preference)}
                />
                <span className="slider round"></span>
              </label>
              {preference === 'Work' && preferredTasks[preference] === true && (
                <div>
                  <p>Describe your Work preference</p>
                  <input
                    type="text"
                    placeholder="Describe your work"
                    value={workPreferences}
                    onChange={e => setWorkPreferences(e.target.value)}
                  />
                </div>
              )}
              {preference === 'Reading' && preferredTasks[preference] === true && (
                <div>
                  <p>Describe your Reading preference</p>
                  <input
                    type="text"
                    placeholder="Describe your readings"
                    value={readingPreferences}
                    onChange={e => setReadingPreferences(e.target.value)}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
        <li>
          <label htmlFor="taskFrequency">Task Frequency</label>
          <input
            id="taskFrequency"
            type="text"
            placeholder="HH:mm"
            value={taskFrequency}
            pattern="[0-9]{2}:[0-9]{2}"
            onChange={e => {
              const frequency = e.target.value;
              if (/^[0-9:]*$/.test(frequency)) {
                const [hours, minutes] = frequency.split(':').map(Number);
                if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                  setTaskFrequency(frequency);
                }
              }
            }}
          />
        </li>
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Preference;
