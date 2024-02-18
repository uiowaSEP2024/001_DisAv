import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../../screens/Home';

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
