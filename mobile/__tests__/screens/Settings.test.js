import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Settings from '../../screens/Settings';

// Mock the useNavigation hook from @react-navigation/native
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// Mock the useSession hook before your describe block
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    login: jest.fn().mockImplementation(() => Promise.resolve(true)), // Mock implementation of login
    // Add other functions or values returned by useSession if necessary
  }),
}));

describe('Settings Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // If you are using fake timers
  });
  it('renders correctly', () => {
    const { getByText } = render(<Settings />);
    expect(getByText('Settings Screen')).toBeTruthy();
  });

  it('navigates to Home on button press', () => {
    const navigate = jest.fn();
    // Here we mock the navigation prop to simulate navigation
    const { getByText } = render(<Settings navigation={{ navigate }} />);

    fireEvent.press(getByText('Go to Home'));
    expect(navigate).toHaveBeenCalledWith('Home');
  });
});
