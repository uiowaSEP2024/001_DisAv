import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RewardHistory from '../RewardHistory'; // Ensure the path is correct

describe('RewardHistory Component', () => {
  it('renders without crashing', () => {
    render(<RewardHistory />);
    // Use a regular expression to find a partial match
    const partialMatch = screen.getByText(/Completed:/i);
    expect(partialMatch).toBeInTheDocument();
  });

  it('renders the correct number of history items', () => {
    render(<RewardHistory />);
    // Use queryAllByText to safely check for multiple items without throwing an error
    const historyItems = screen.queryAllByText(/Completed:/i);
    expect(historyItems).toHaveLength(1); // Update this number based on the number of items you expect
  });

  it('displays the correct text for history items', () => {
    render(<RewardHistory />);
    // Check for specific content in your history items
    expect(screen.getByText(/Completed: Task 1 on 2024-02-29: Earned 500 points/i)).toBeInTheDocument();
    // expect(screen.getByText(/Completed: Task 2 on 2024-02-26: Earned 250 points/i)).toBeInTheDocument();
  });
});
