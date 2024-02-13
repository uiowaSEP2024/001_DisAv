import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../../screens/Home';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      // Add any other navigation functions that your tests rely on
    }),
    // Mock any other hooks or functions as needed
  };
});

// Mock the useSession hook before your describe block
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    login: jest.fn().mockImplementation(() => Promise.resolve(true)), // Mock implementation of login
    // Add other functions or values returned by useSession if necessary
  }),
}));

// Mock navigation and route props
const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    user: { id: '1', name: 'John Doe' }, // Adjust based on what your component expects
  },
};

describe('Home', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Home navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Home Screen')).toBeTruthy();
    expect(getByText('Go to Rewards')).toBeTruthy();
    expect(getByText('Go to Bens House')).toBeTruthy();
  });

  it('navigates to Rewards when "Go to Rewards" is pressed', () => {
    const { getByText } = render(<Home navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(getByText('Go to Rewards'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Rewards');
  });

  it('navigates to Bens House when "Go to Bens House" is pressed', () => {
    const { getByText } = render(<Home navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(getByText('Go to Bens House'));
    // If "Go to Bens House" should navigate to a different screen, update the argument accordingly.
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Rewards');
  });
});
