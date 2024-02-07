import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUpScreen from '../../screens/SignUp';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('react-native/Libraries/Animated/src/Animated', () => 'Animated');

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers(); // If you are using fake timers
});

describe('SignUp Screen', () => {
  it('allows the user to sign up', () => {
    const { getByText, getByTestId } = render(<SignUpScreen />);
    // Correctly target the inputs by their testID and change their text
    fireEvent.changeText(getByTestId('email-input'), 'john@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password');
    fireEvent.press(getByText('Sign Up'));
    // Assert something about the sign-up process
  });
});
