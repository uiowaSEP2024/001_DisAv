// Preference.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/preference.css';
import DurationPicker from 'react-duration-picker';

const defaultTasks = {
  Work: false,
  Reading: false,
  Exercise: false,
  Break: false,
};

const Preference = ({ initialPreferredTasks = defaultTasks, onClose = () => {} }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [initialUser, setInitialUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [preferredTasks, setPreferences] = useState(initialPreferredTasks); // Initialize as empty object
  const [taskFrequency, setTaskFrequency] = useState(0); // Initialize task frequency
  const [workPreferences, setWorkPreferences] = useState('');
  const [readingPreferences, setReadingPreferences] = useState('');
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const onChangeDuration = (time) => {
    const { hours, minutes, seconds } = time;
    setDuration({ hours, minutes, seconds });
  };
  useEffect(() => {
    // Load the user's preferences when the component mounts
    if (initialUser && initialUser.preferredTasks) {
      setPreferences(initialUser.preferredTasks);
      // Fetch preferredTasks from the database for new user
    }
    if (initialUser && !initialUser.preferredTasks) {
      setPreferences(defaultTasks);
    }
    if (user && user.taskFrequency) {
      const hours = Math.floor(initialUser.taskFrequency / 3600000);
      const minutes = Math.floor((initialUser.taskFrequency % 3600000) / 60000);
      const formattedFrequency = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      setTaskFrequency(formattedFrequency); // Set task frequency from user data
    }
    if (initialUser && initialUser.workPreferences) {
      setWorkPreferences(initialUser.workPreferences); // Set work preferences from user data
    }
    if (initialUser && initialUser.readingPreferences) {
      setReadingPreferences(initialUser.readingPreferences); // Set reading preferences from user data
    }
  }, [initialUser]);

  const handleToggle = preference => {
    const updatedPreferences = {
      ...preferredTasks,
      [preference]: preferredTasks[preference] === true ? false : true, // Toggle the value
    };

    setPreferences(updatedPreferences);
  };

  // Inside the Preference component

  const handleSubmit = () => {

    // Update the user's preferred tasks in the database
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
      })
      .catch(error => {
        console.error('Failed to update preferences', error);
      });

    // Convert HH:mm to milliseconds
    const milliseconds = timeToMs(duration.hours, duration.minutes, duration.seconds);

    // Update the user's task frequency in the database
    axios
      .put('http://localhost:3002/user/update-task-frequency', {
        username: user.username,
        taskFrequency: milliseconds,
      })
      .then(response => {
        // Update user data in sessionStorage with new preferences
        sessionStorage.setItem('user', JSON.stringify({ ...user, taskFrequency: milliseconds }));
        setUser({ ...user, taskFrequency: milliseconds });
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
        sessionStorage.setItem(
          'user',
          JSON.stringify({ ...user, workPreferences: workPreferences })
        );
        setUser({ ...user, workPreferences: workPreferences });
        setWorkPreferences(''); // Reset the workPreferences state
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
        sessionStorage.setItem(
          'user',
          JSON.stringify({ ...user, readingPreferences: readingPreferences })
        );
        setUser({ ...user, readingPreferences: readingPreferences });
        setReadingPreferences(''); // Reset the readingPreferences state
      })
      .catch(error => {
        console.error('Failed to update reading preferences', error);
      });

    onClose(); // Close the pop-up after submitting preferences
  };
  function timeToMs(hours, minutes, seconds) {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds * 1000;
  }
  return (
    <div className="preferences">
      <h2>User Preferences</h2>
      <label>What kind of tasks would you like to use?</label>
      <ul>
        {Object.keys(preferredTasks).map(preference => (
          <li key={preference} className={"left-aligned-list"}>
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
        <br/>
        <li>
          <label htmlFor="taskFrequency">How often should tasks be triggered?</label>
          <DurationPicker
            onChange={(time)=> {onChangeDuration(time)}}
            initialDuration={{ hours: 0, minutes: 0, seconds: 0 }}
            maxHours={23}
            value={duration}
            seconds={0}
          />
        </li>
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Preference;
