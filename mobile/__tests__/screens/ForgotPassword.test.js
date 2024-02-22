import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ForgotPassword from '../../screens/ForgotPassword';

// Assuming you're using useNavigation or passing navigation prop directly
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the useSession hook before your describe block
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    login: jest.fn().mockImplementation(() => Promise.resolve(true)), // Mock implementation of login
    // Add other functions or values returned by useSession if necessary
  }),
}));

describe('ForgotPassword Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // If you are using fake timers
  });
  it('renders correctly and can navigate to Login', () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(<ForgotPassword navigation={{ navigate: mockNavigate }} />);
    // Now, when you trigger the button press, `mockNavigate` will be called instead of throwing an error.
    fireEvent.press(getByText('Go to Login'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
    // Since navigation is mocked, you won't actually navigate, but you can assert that navigate was called
    // This part depends on how you implement the mock and use it in your component
  });
});
