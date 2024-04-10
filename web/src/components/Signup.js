import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';
import '../styles/signup.css';
import Modal from 'react-modal';
import Preference from './Preference'; // Assuming the Preference component is in a separate file

function Signup() {
  //toast.configure();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use the login function from AuthContext
  const [modalIsOpen, setIsOpen] = useState(false);

  const [initialPreferredTasks, setInitialPreferredTasks] = useState({
    Work: false,
    Reading: false,
    Break: false,
    Exercise: false,
  });

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    navigate('/dashboard');
    setIsOpen(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/auth/register', {
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        email: email,
      });

      if (response.data.message === 'User already exists') {
        //toast.error('Username is already used');
        console.log('Username is already used');
      } else {
        //toast.success('Account has been created successfully');
        console.log('Account has been created successfully');
        // Log in the user after successful signup

        login({ username, password, firstname, lastname, email }); // Adjust the object to match what your login function expects
        openModal(); // Open the modal for preference selection

      }
    } catch (err) {
      if (err.response) {
        // Handle HTTP errors here
        //toast.error(err.response.data.message);
        console.error(err.response.data.message);
      } else {
        // Handle other errors here
        //toast.error('Signup failed. Please try again later.');
        console.error('Signup failed. Please try again later.');
      }
      console.error(err);
    }
  };

  return (
    <div className="signup">
      <form onSubmit={handleSubmit} data-testid="signup-form">
        <h2>Sign up</h2>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required={true} />
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required={true}/>
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required={true}/>
        <input type="text" placeholder="First Name" onChange={e => setFirstname(e.target.value)} required={true}/>
        <input type="text" placeholder="Last Name" onChange={e => setLastname(e.target.value)} required={true}/>
        <button className={'submit'} type="submit">
          Sign Up
        </button>
      </form>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Select Preferences">
        <Preference initialPreferredTasks={initialPreferredTasks} onClose={closeModal} />
        {/* <button onClick={() => { closeModal(); navigate('/dashboard'); }}>Submit and Go to Dashboard</button> */}
      </Modal>
    </div>
  );
}

export default Signup;
