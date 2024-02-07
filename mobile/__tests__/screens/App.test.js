import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers(); // If you are using fake timers
});

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Assuming your AppNavigator has a default screen, for example, "Login"
    // You can adjust this to match the initial route name in your AppNavigator
    // expect(getByText('Login')).toBeTruthy();
  });
});
