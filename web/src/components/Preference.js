import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/preference.css';

const Preference = () => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
    const [preferredTasks, setPreferences] = useState({
        Work: false,
        Reading: false,
        Exercise: false,
        Break: false
    });

    useEffect(() => {
        // Load the user's preferences when the component mounts
        if (user && user.preferredTasks) {
            setPreferences(user.preferredTasks);
        }
    }, [user]);
    const handleToggle = (preference) => {
        const updatedPreferences = {
            ...preferredTasks,
            [preference]: !preferredTasks[preference]
        };
        setPreferences(updatedPreferences);
        // Update preferences in the database

        axios.put('http://localhost:3002/user/update-preferred-tasks', {
            username: user.username,
            preferredTasks: updatedPreferences

        })

            .then(response => {
                // Update user data in sessionStorage with new preferences
                sessionStorage.setItem('user', JSON.stringify({ ...user, preferredTasks: updatedPreferences }));
                setUser({ ...user, preferredTasks: updatedPreferences });
            })
            .catch(error => {
                console.error('Failed to update preferences', error);
            });
    };

    return (
        <div className="preferences">
            <h2>User Preferences</h2>
            <ul>
                {Object.keys(preferredTasks).map((preference) => (
                    <li key={preference}>
                        <div className="preference-item">
                            <label htmlFor={preference}>{preference.charAt(0).toUpperCase() + preference.slice(1)}</label>                            <label className="switch">
                                <input
                                    id={preference}
                                    type="checkbox"
                                    checked={preferredTasks[preference]}
                                    onChange={() => handleToggle(preference)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Preference;
