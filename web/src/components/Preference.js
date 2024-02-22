// Preference.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/preference.css';


const defaultTasks = {
  "Work": false,
  "Reading": false,
  "Exercise": false,
  "Break": false
};

const Preference = ({ initialPreferredTasks = defaultTasks, onClose = () => {} }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [preferredTasks, setPreferences] = useState(initialPreferredTasks); // Initialize as empty object

  useEffect(() => {
    // Load the user's preferences when the component mounts
    if (user && user.preferredTasks) {
      setPreferences(user.preferredTasks);
      // Fetch preferredTasks from the database for new user
    }
    if (user && !user.preferredTasks) {
      setPreferences(defaultTasks);
    }
  }, [user]);

  const handleToggle = preference => {
    const updatedPreferences = {
      ...preferredTasks,
      [preference]: preferredTasks[preference] === "true" ? "false" : "true", // Toggle the value
    };

    if (updatedPreferences[preference] === "true") {
      updatedPreferences[`${preference}Frequency`] = ''; // Initialize frequency as empty string
    } else {
      delete updatedPreferences[`${preference}Frequency`]; // Remove frequency field when switch is disabled
    }

    setPreferences(updatedPreferences);
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
        onClose(); // Close the pop-up after submitting preferences
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
                  checked={preferredTasks[preference] === "true"}
                  onChange={() => handleToggle(preference)}
                />
                <span className="slider round"></span>
              </label>
              {preferredTasks[preference] === "true" && ( // Conditionally render frequency input
                <input
                type="text" // Change input type to text
                data-testid={`${preference}Frequency`} // Add data-testid attribute
                placeholder="HH:mm" // Specify the expected format
                value={preferredTasks[`${preference}Frequency`] || ':'}
                pattern="[0-9]{2}:[0-9]{2}" // Restrict input to numbers and :
                onChange={e => {
                  const frequency = e.target.value;
                  if (/^[0-9:]*$/.test(frequency)) { // Validate input against the pattern
                    const [hours, minutes] = frequency.split(':').map(Number);
                    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                      setPreferences(prevState => ({
                        ...prevState,
                        [`${preference}Frequency`]: frequency,
                      }));
                    }
                  }
                }}
              />
              )}
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Preference;
