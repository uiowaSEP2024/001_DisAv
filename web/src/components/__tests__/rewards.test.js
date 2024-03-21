import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Rewards from '../Rewards'; // Adjust the import path as necessary
import axios from 'axios';

jest.mock('axios');

describe('Rewards Component', () => {
  const mockTasks = [
    { taskType: 'Task 1', date: new Date(), points: 10 },
    { taskType: 'Task 2', date: new Date(), points: 20 },
  ];

  beforeEach(() => {
    sessionStorage.setItem('user', JSON.stringify({ username: 'testUser' }));
    axios.get.mockResolvedValue({ data: { tasks: mockTasks } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders without crashing and displays initial total points', async () => {
    render(<Rewards />);
    expect(screen.getByText(/Your Rewards/i)).toBeInTheDocument();
    expect(screen.getByText(/You have earned 0 points/i)).toBeInTheDocument();
  });

  it('updates total points when RewardHistory updates points', async () => {
    render(<Rewards />);
    // Since RewardHistory is a child component that fetches tasks and updates total points,
    // you might want to wait for those updates to propagate.
    // This assumes RewardHistory calls the setTotalPoints function passed as a prop.
    await screen.findByText(/You have earned 30 points/);
    expect(screen.getByText(/You have earned 30 points/i)).toBeInTheDocument();
  });

  it('activates the history tab and shows RewardHistory', async () => {
    render(<Rewards />);
    const historyTab = screen.getByText('History');
    fireEvent.click(historyTab);
    // Verify the tab is active; this assumes active tab has 'active' class
    expect(historyTab).toHaveClass('active');
    // Since RewardHistory's rendering is based on activeTab's state, check for an element unique to RewardHistory
    // Example: Check for a specific task being rendered
    await screen.findByText(/Completed: Task 1 on/i);
  });
});
