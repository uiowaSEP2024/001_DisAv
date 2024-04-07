import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../Login';
import { toast } from 'react-toastify';
import { AuthContext } from '../AuthContext';


jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    configure: jest.fn(),
  },
}));

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    axios.post.mockClear();
    toast.error.mockClear();
    toast.success.mockClear();
  });
  it('renders correctly', () => {
    const mockAuthContextValue = {
      isLoggedIn: false,
      logout: jest.fn(),
    };
    const { getByTestId } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>);
    expect(getByTestId('login-form')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const mockAuthContextValue = {
      isLoggedIn: false,
      logout: jest.fn(),
    };
    const { getByLabelText } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>);
    const usernameInput = getByLabelText('Username:');
    const passwordInput = getByLabelText('Password:');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  it('login button triggers API call with entered username and password', async () => {
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

  it('handles successful login', async () => {
    const mockAuthContextValue = {
      isLoggedIn: false,
      login: jest.fn(),
      logout: jest.fn(),
    };

    const mockLoginResponse = {
      status: 200,
      data: {
        message: 'Login successful',
        token: 'fakeToken',
        user: {
          username: 'testuser',
          taskFrequency: 'daily',
        },
      },
    };

    axios.post.mockResolvedValue(mockLoginResponse);

    const { getByLabelText, getByTestId } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    const usernameInput = getByLabelText('Username:');
    const passwordInput = getByLabelText('Password:');
    const submitButton = getByTestId('submit-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3002/auth/login', {
        username: 'testuser',
        password: 'testpass',
      });
      expect(mockAuthContextValue.login).toHaveBeenCalledWith(mockLoginResponse.data.user);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login failure (none existing user)', async () => {
    const mockAuthContextValue = {
      isLoggedIn: false,
      logout: jest.fn(),
    };
    axios.post.mockRejectedValue({
      response: {
        status: 404,
        data: {
          message: 'User does not exist',
        },
      },
    });

    const { getByLabelText, getByTestId } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>);
    const usernameInput = getByLabelText('Username:');
    const passwordInput = getByLabelText('Password:');
    const submitButton = getByTestId('submit-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User does not exist'); // Ensure this message matches exactly what your component uses
    });
  });

  it('handles login failure (incorrect password)', async () => {
    const mockAuthContextValue = {
      isLoggedIn: false,
      logout: jest.fn(),
    };
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: {
          message: 'Username or Password incorrect',
        },
      },
    });

    const { getByLabelText, getByTestId } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>);
    const usernameInput = getByLabelText('Username:');
    const passwordInput = getByLabelText('Password:');
    const submitButton = getByTestId('submit-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Password incorrect'); // Ensure this message matches exactly what your component uses
    });
  });

  it('handles other errors', async () => {
    const mockAuthContextValue = {
      isLoggedIn: false,
      logout: jest.fn(),
    };
    axios.post.mockRejectedValue({
      response: {
        status: 999,
        data: {
          message: 'Login failed. Please try again later.',
        },
      },
    },);

    const { getByLabelText, getByTestId } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>);
    const usernameInput = getByLabelText('Username:');
    const passwordInput = getByLabelText('Password:');
    const submitButton = getByTestId('submit-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed. Please try again later.'); // Ensure this message matches exactly what your component uses
    });
  });

});
