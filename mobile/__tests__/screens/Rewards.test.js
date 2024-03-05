import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Rewards from '../../screens/Rewards';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSession } from '../../context/SessionContext';

// Mock axios
jest.mock('axios');

// Mock the useSession hook
jest.mock('../../context/SessionContext', () => ({
  useSession: jest.fn(),
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock response data for axios
const mockTasksData = {
  data: {
    tasks: [
      { isCompleted: true, points: 10, username: 'testuser' },
      { isCompleted: true, points: 20, username: 'testuser' },
      // Add more tasks as needed
    ],
  },
};

axios.get.mockResolvedValue(mockTasksData);

// Mock the api variable from the config file
jest.mock('../../config/Api', () => ({
  api: 'localhost:3002',
}));

describe('Rewards Screen', () => {
  beforeEach(() => {
    // Reset mocks before each test
    axios.get.mockClear();
    mockNavigation.navigate.mockClear();

    // Set up the useSession mock return value
    useSession.mockReturnValue({
      user: {
        username: 'testuser',
      },
    });
  });

  it('fetches user tasks and displays total points', async () => {
    const { getByText } = render(
      <PaperProvider>
        <Rewards navigation={mockNavigation} />
      </PaperProvider>
    );

    // Wait for the axios call to resolve and the component to update
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/task/get-by-username?username=testuser')
      );

      // Assuming the total points are calculated correctly, they should be displayed
      expect(getByText('Total Points: 30')).toBeTruthy();
    });
  });

  // Add more tests as needed, for example, testing animations, confetti effect, etc.
});
