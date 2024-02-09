import React, { useState } from 'react';
import axios from 'axios';
import '../styles/signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/register', { username, email, password, firstname, lastname });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="signup">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="First Name" onChange={(e) => setFirstname(e.target.value)} />
        <input type="text" placeholder="Last Name" onChange={(e) => setLastname(e.target.value)} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
