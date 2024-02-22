import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/preference.css';

const Preference = () => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [preferredTasks, setPreferences] = useState({}); // Initialize as empty object

  useEffect(() => {
    // Load the user's preferences when the component mounts
    if (user && user.preferredTasks) {
      setPreferences(user.preferredTasks);
    } else {
      // Fetch preferredTasks from the database for new user
      axios
        .get(`http://localhost:3002/user/preferred-tasks/${user.username}`)
        .then(response => {
          setPreferences(response.data.preferredTasks);
        })
        .catch(error => {
          console.error('Failed to fetch preferences', error);
        });
    }
  }, [user]);

  const handleToggle = preference => {
    const updatedPreferences = {
      ...preferredTasks,
      [preference]: !preferredTasks[preference], // Toggle the value
    };
    setPreferences(updatedPreferences);

    // Send the updated preference to the database
    axios
      .put('http://localhost:3002/user/update-preferred-tasks', {
        username: user.username,
        preferredTasks: updatedPreferences,
      })
      .then(response => {
        // Update user data in sessionStorage with new preferences
        sessionStorage.setItem(
          'user',
          JSON.stringify({ ...user, preferredTasks: updatedPreferences })
        );
        setUser({ ...user, preferredTasks: updatedPreferences });
      })
      .catch(error => {
        console.error('Failed to update preferences', error);
      });
  };

  const handleSubmit = () => {
    axios
      .put('http://localhost:3002/user/update-preferred-tasks', {
        username: user.username,
        preferredTasks: preferredTasks,
      })
      .then(response => {
        // Update user data in sessionStorage with new preferences
        sessionStorage.setItem('user', JSON.stringify({ ...user, preferredTasks: preferredTasks }));
        setUser({ ...user, preferredTasks: preferredTasks });
      })
      .catch(error => {
        console.error('Failed to update preferences', error);
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
                  checked={
                    preferredTasks[preference] === 'true'
                      ? true
                      : preferredTasks[preference] === 'false'
                        ? false
                        : undefined
                  } // Use the preferredTasks value directly
                  onChange={() => handleToggle(preference)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit</button> {/* Added submit button */}
    </div>
  );
};

export default Preference;
