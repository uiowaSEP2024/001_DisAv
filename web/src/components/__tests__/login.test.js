import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../Login';
import { AuthContext } from '../AuthContext';


jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

test('renders login form', () => {
  const mockAuthContextValue = {
    isLoggedIn: false,
    logout: jest.fn(),
  };

  render(
    <AuthContext.Provider value={mockAuthContextValue}>
    <MemoryRouter>
      <Login />
    </MemoryRouter>
    </AuthContext.Provider>
  );

  const loginForm = screen.getByTestId('login-form');
  expect(loginForm).toBeInTheDocument();
});

test('allows the user to enter username and password', () => {
  const mockAuthContextValue = {
    isLoggedIn: false,
    logout: jest.fn(),
  };
  render(
    <AuthContext.Provider value={mockAuthContextValue}>
    <MemoryRouter>
      <Login />
    </MemoryRouter>
    </AuthContext.Provider>
  );

  const usernameInput = screen.getByLabelText(/username:/i);
  const passwordInput = screen.getByLabelText(/password:/i);

  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });

  expect(usernameInput.value).toBe('testuser');
  expect(passwordInput.value).toBe('password');

});

test('login button triggers API call with entered username and password', async () => {
  const mockAuthContextValue = {
    isLoggedIn: false,
    logout: jest.fn(),
  };

  const mockLoginResponse = {
    data: {
      message: 'Login successful',
      token: 'fakeToken',
      user: 'testuser',
    },
  };

  axios.post.mockResolvedValue(mockLoginResponse);

  render(
    <AuthContext.Provider value={mockAuthContextValue}>
    <MemoryRouter>
      <Login />
    </MemoryRouter>
    </AuthContext.Provider>
  );

  const usernameInput = screen.getByLabelText(/username:/i);
  const passwordInput = screen.getByLabelText(/password:/i);
  const submitButton = screen.getByTestId('submit-button');

  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3002/auth/login', {
      username: 'testuser',
      password: 'password',
    });
  });
});


test('successful login renders the dashboard', async () => {
  const mockAuthContextValue = {
    isLoggedIn: true,
    login: jest.fn(),
  };

  const mockLoginResponse = {
    data: {
      message: 'Login successful',
      token: 'fakeToken',
      user: 'testuser',
    },
  };

  axios.post.mockResolvedValue(mockLoginResponse);

  render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <MemoryRouter>
          <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const usernameInput = screen.getByLabelText(/username:/i);
  const passwordInput = screen.getByLabelText(/password:/i);
  const submitButton = screen.getByTestId('submit-button');

  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    // Assuming that the dashboard page contains a specific element, such as a header with the text 'Dashboard'
    // expect(screen.getByText('Dashboard')).toBeInTheDocument();
    // Alternatively, check if the navigation function was called with the dashboard route
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
