import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import Login from '../../screens/Login';

jest.mock('axios');

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      dev: true, // Or false, depending on your testing needs
    },
    hostUri: 'http://192.168.0.113:3002',
  },
}));

// Mock the useSession hook before your describe block
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    login: jest.fn().mockImplementation(() => Promise.resolve(true)), // Mock implementation of login
    // Add other functions or values returned by useSession if necessary
  }),
}));

jest.mock('react-native/Libraries/Animated/src/Animated', () => 'Animated');

const mockNavigation = {
  popToTop: jest.fn(),
  navigate: jest.fn(),
};

describe('Login', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    axios.post.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it('renders the login form', () => {
    const { getByTestId } = render(<Login navigation={mockNavigation} />);
    expect(getByTestId('userNameInput')).toBeTruthy();
    expect(getByTestId('passwordInput')).toBeTruthy();
    expect(getByTestId('loginButton')).toBeTruthy();
  });

  it('updates input fields and calls axios post on form submission', async () => {
    const mockResponse = { data: { user: 'testUser' } };
    axios.post.mockResolvedValue(mockResponse);

    const { getByTestId } = render(<Login navigation={mockNavigation} />);

    // Simulate user typing
    fireEvent.changeText(getByTestId('userNameInput'), 'John');
    fireEvent.changeText(getByTestId('passwordInput'), '123456');

    // Submit the form
    fireEvent.press(getByTestId('loginButton'));

    // Wait for the axios call to happen
    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // Check axios was called with correct arguments
    expect(axios.post).toHaveBeenCalledWith('http://http:3002/auth/login', {
      username: 'John',
      password: '123456',
    });

    // Additional checks can be made here, for example:
    // Verify navigation upon successful login

    // - Check for error messages if login fails
  });

  it('displays an error message when login fails', async () => {
    axios.post.mockRejectedValue(new Error('An error occurred during login.'));

    const { getByTestId } = render(<Login navigation={mockNavigation} />);

    fireEvent.changeText(getByTestId('userNameInput'), 'John');
    fireEvent.press(getByTestId('loginButton'));

    await waitFor(() => expect(getByTestId('errorText')).toBeTruthy());
  });

  // You can add more tests here to cover other functionalities and edge cases
});
