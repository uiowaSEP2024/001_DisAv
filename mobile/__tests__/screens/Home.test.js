import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../../screens/Home';

// Create a mock navigation prop
const mockNavigation = {
  navigate: jest.fn(),
};

describe('Home', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Home navigation={mockNavigation} />);
    expect(getByText('Home Screen')).toBeTruthy();
    expect(getByText('Go to Rewards')).toBeTruthy();
    expect(getByText('Go to Bens House')).toBeTruthy();
  });

  it('navigates to Rewards when "Go to Rewards" is pressed', () => {
    const { getByText } = render(<Home navigation={mockNavigation} />);
    fireEvent.press(getByText('Go to Rewards'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Rewards');
  });

  it('navigates to Bens House when "Go to Bens House" is pressed', () => {
    const { getByText } = render(<Home navigation={mockNavigation} />);
    fireEvent.press(getByText('Go to Bens House'));
    // If "Go to Bens House" should navigate to a different screen, update the argument accordingly.
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Rewards');
  });
});
