import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Signup from '../Signup';
import { AuthProvider } from '../AuthContext';
import Preference from '../Preference';

// Mock the Preference component
jest.mock('../Preference', () => {
  // Import useEffect inside the mock function
  const { useEffect } = require('react');

  // Mock component that calls onClose immediately when it's rendered
  return ({ onClose }) => {
    useEffect(() => {
      onClose();
    }, [onClose]);

    return null;
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: () => jest.fn(), // mock hook
}));

jest.mock('axios');

global.console = {
  error: jest.fn(),
  log : jest.fn()
};

describe('Signup', () => {
  it('renders the signup form', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );
    const form = screen.getByTestId('signup-form');
    expect(form).toBeInTheDocument();
  });

  it('calls axios post on form submission', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstnameInput = screen.getByPlaceholderText('First Name');
    const lastnameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.change(firstnameInput, { target: { value: 'Test' } });
    fireEvent.change(lastnameInput, { target: { value: 'User' } });

    axios.post.mockResolvedValue({ data: {} });

    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  it ('logs in the user after successful signup', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstnameInput = screen.getByPlaceholderText('First Name');
    const lastnameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.change(firstnameInput, { target: { value: 'Test' } });
    fireEvent.change(lastnameInput, { target: { value: 'User' } });

    axios.post.mockResolvedValue({ data: { message: 'Account has been created successfully' } });

    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(console.log).toHaveBeenCalledWith('Account has been created successfully');

    // Check that login function was called with the correct arguments

    // Check that openModal function was called

  });

  it ('handles signup failure', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstnameInput = screen.getByPlaceholderText('First Name');
    const lastnameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.change(firstnameInput, { target: { value: '' } });
    fireEvent.change(lastnameInput, { target: { value: '' } });

    axios.post.mockRejectedValue(new Error('An error occurred'));

    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    // Check that error message is displayed

  });

  it ('handles user already exists scenario', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstnameInput = screen.getByPlaceholderText('First Name');
    const lastnameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.change(firstnameInput, { target: { value: 'Test' } });
    fireEvent.change(lastnameInput, { target: { value: 'User' } });

    // Mock response where user already exists
    axios.post.mockResolvedValue({ data: { message: 'User already exists' } });

    // Simulate form submission
    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(console.log).toHaveBeenCalledWith('Username is already used');
  });

  it ('handles signup failure due to server error, no response message', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstnameInput = screen.getByPlaceholderText('First Name');
    const lastnameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.change(firstnameInput, { target: { value: 'Test' } });
    fireEvent.change(lastnameInput, { target: { value: 'User' } });

    // Mock a server error
    axios.post.mockRejectedValue({ });

    // Simulate form submission
    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // Check console.error was called
    expect(console.error).toHaveBeenCalledWith('Signup failed. Please try again later.');
  });

  it ('handles signup failure due to server error', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstnameInput = screen.getByPlaceholderText('First Name');
    const lastnameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.change(firstnameInput, { target: { value: 'Test' } });
    fireEvent.change(lastnameInput, { target: { value: 'User' } });

    // Mock a server error
    axios.post.mockRejectedValue({ response: { data: { message: 'An error occurred' } }});

    // Simulate form submission
    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // Check console.error was called
    expect(console.error).toHaveBeenCalledWith('An error occurred');
  });

  it ('navigates to dashboard and closes modal after successful signup', async () => {
    const navigate = require('react-router-dom').useNavigate();

    render(
      <MemoryRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstnameInput = screen.getByPlaceholderText('First Name');
    const lastnameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.change(firstnameInput, { target: { value: 'Test' } });
    fireEvent.change(lastnameInput, { target: { value: 'User' } });


    // Mock successful form submission
    axios.post.mockResolvedValue({ data: { message: 'Account has been created successfully' } });

    // Simulate form submission
    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // Check that navigate was called with '/dashboard'
    //expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

});
