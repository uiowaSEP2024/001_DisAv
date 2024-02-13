import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from '../../screens/SignUp';
import axios from 'axios';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

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

jest.mock('axios');

describe('SignUp Screen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    axios.post.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('successfully signs up a user', async () => {
    axios.post.mockResolvedValue({ data: { message: 'User successfully created' } });

    const { getByTestId } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId('firstNameInput'), 'John');
    fireEvent.changeText(getByTestId('lastNameInput'), 'Doe');
    fireEvent.changeText(getByTestId('userNameInput'), 'johndoe');
    fireEvent.changeText(getByTestId('emailInput'), 'john@example.com');
    fireEvent.changeText(getByTestId('passwordInput'), 'password');
    fireEvent.changeText(getByTestId('rePasswordInput'), 'password');

    fireEvent.press(getByTestId('signUpButton'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://http:3002/auth/register', {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password',
      });
    });
  });
});
