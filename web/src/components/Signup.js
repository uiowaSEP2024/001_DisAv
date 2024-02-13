import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/signup.css';



function Signup() {
  toast.configure();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/auth/register", {
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        email: email
      })
      .then(r => {
        if (r.data.message === 'User already exists') {
            console.log('Username is already used');
          toast.error('Username is already used');

        } else {
          toast.success('Account has been created successfully');
          navigate('/'); // Redirect to home page
        }
      })
      .catch(err => {
        console.log(err);
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="signup">
      <form onSubmit={handleSubmit} data-testid="signup-form">
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
