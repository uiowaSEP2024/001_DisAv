import React from 'react';
import { render } from '@testing-library/react-native';
import Login from '../../screens/Login';

// jest.mock('@react-navigation/native', () => ({
//     ...jest.requireActual('@react-navigation/native'),
//     useNavigation: () => ({
//       navigate: jest.fn(),
//     }),
//   }));
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

describe('Login Screen', () => {
  it('renders all expected elements', () => {
    const { getByTestId, getByText } = render(<Login />);

    // Assuming your Login screen has these elements
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    // Add more assertions as needed
  });
});
