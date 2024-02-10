import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      dev: true, // Or false, depending on your testing needs
    },
    hostUri: 'http://192.168.0.113:3002',
  },
}));

describe('App', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // If you are using fake timers
  });

  it('renders without crashing', () => {
    render(<App />);
    // Assuming your AppNavigator has a default screen, for example, "Login"
    // You can adjust this to match the initial route name in your AppNavigator
    // expect(getByText('Login')).toBeTruthy();
  });
});
