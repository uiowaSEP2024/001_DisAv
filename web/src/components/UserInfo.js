import React, { useState } from 'react';
import axios from 'axios';
import '../styles/userinfo.css';

function UserInfo({ user: initialUser }) {
  const [user, setUser] = useState({ ...initialUser });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUser({ ...initialUser }); // Reset user state to initialUser
    setIsEditing(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const updateUser = { ...user };
    delete updateUser.confirmPassword; // Remove confirmPassword before sending to the server
    axios
      .put('http://localhost:3002/user/update', { user: updateUser })
      .then(response => {
        console.log('Profile updated', response);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating profile', error);
      });
  };

  return (
    <div className="user-info">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={user.firstname || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={user.lastname || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={user.password || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          value={user.email || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
        {isEditing && (
          <>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={user.confirmPassword || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </>
        )}
      </form>
      {!isEditing && (
        <button className="btn-edit-profile" onClick={handleEdit}>
          Edit Profile
        </button>
      )}
    </div>
  );
}

export default UserInfo;
