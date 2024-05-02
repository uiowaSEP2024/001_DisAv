import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/preference.css';
import DurationPicker from 'react-duration-picker';
import { toast } from 'react-toastify';

const defaultTasks = {
  Work: false,
  Reading: false,
  Exercise: false,
  Break: false,
};

const Preference = ({ initialPreferredTasks = defaultTasks, onClose = () => {} }) => {
  toast.configure();
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [preferredTasks, setPreferences] = useState(initialPreferredTasks);
  const [workPreferences, setWorkPreferences] = useState('');
  const [readingPreferences, setReadingPreferences] = useState('');
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Load user's initial data and preferences
    const initialUser = JSON.parse(sessionStorage.getItem('user'));
    if (initialUser) {
      const { preferredTasks, workPreferences, readingPreferences, taskFrequency } = initialUser;
      setPreferences(preferredTasks || defaultTasks);
      setWorkPreferences(workPreferences || '');
      setReadingPreferences(readingPreferences || '');
      if (taskFrequency) {
        const hours = Math.floor(taskFrequency / 3600000);
        const minutes = Math.floor((taskFrequency % 3600000) / 60000);
        const formattedFrequency = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        setDuration({ hours, minutes, seconds: 0 });
      }
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const milliseconds = timeToMs(duration.hours, duration.minutes, duration.seconds);
      const updatedUser = {
        ...user,
        preferredTasks,
        workPreferences,
        readingPreferences,
        taskFrequency: milliseconds,
      };

      await axios.put('http://localhost:3002/user/update-preferred-tasks', {
        username: user.username,
        preferredTasks,
      });
      await axios.put('http://localhost:3002/user/update-task-frequency', {
        username: user.username,
        taskFrequency: milliseconds,
      });
      await axios.put('http://localhost:3002/user/update-work-preferences', {
        username: user.username,
        workPreferences,
      });
      await axios.put('http://localhost:3002/user/update-reading-preferences', {
        username: user.username,
        readingPreferences,
      });

      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Updated successfully');
    } catch (error) {
      console.error('Failed to update preferences', error);
      toast.error('Error: could not update');
    }

    onClose(); // Close the pop-up after submitting preferences
  };

  function timeToMs(hours, minutes, seconds) {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds * 1000;
  }

  return (
    <div className="preferences">
      <h2>User Preferences</h2>
      <ul>
        <div>
          <p>What kind of work do you typically do</p>
          <input
            type="text"
            placeholder="Describe your work"
            value={workPreferences}
            onChange={e => setWorkPreferences(e.target.value)}
          />
        </div>
        <br />
        <li>
          <label htmlFor="taskFrequency">How often should tasks be triggered?</label>
          <DurationPicker
            onChange={setDuration}
            initialDuration={{ hours: 0, minutes: 0, seconds: 0 }}
            maxHours={23}
            value={duration}
            seconds={0}
          />
        </li>
      </ul>
      <button
        onClick={handleSubmit}
        style={{
          zIndex: 20,
          cursor: 'pointer',
          backgroundColor: '#6210be',
          color: 'white',
          width: '90px',
          height: '40px',
          borderRadius: '10px',
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Preference;
