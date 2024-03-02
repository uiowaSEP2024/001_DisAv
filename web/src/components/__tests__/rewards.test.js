import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RewardsScreen from '../Rewards'; // Update the path to where your RewardsScreen is located

describe('RewardsScreen', () => {
  test('renders RewardsScreen component', () => {
    render(<RewardsScreen />);
    expect(screen.getByText(/your rewards/i)).toBeInTheDocument();
  });

  test('displays points earned by the user', () => {
    render(<RewardsScreen />);
    expect(screen.getByText(/you have earned \.\.\. points/i)).toBeInTheDocument();
  });

  test('defaults to showing the RewardHistory component', () => {
    render(<RewardsScreen />);
    expect(screen.getByText(/history/i)).toHaveClass('active');
    // Add a testID to your RewardHistory component or some text unique to it to test its presence
  });

  // test('shows the Shop component when the Shop tab is clicked', () => {
  //   render(<RewardsScreen />);
  //   const shopTabButton = screen.getByText(/shop/i);
  //   fireEvent.click(shopTabButton);
  //   expect(shopTabButton).toHaveClass('active');
  //   // Add a testID to your Shop component or some text unique to it to test its presence
  // });

  // More tests here for other functionalities and components...
});
