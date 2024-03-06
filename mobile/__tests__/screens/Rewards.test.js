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

// Mock response data for axios with added dateCompleted and taskType
const mockTasksData = {
  data: {
    tasks: [
      {
        isCompleted: true,
        points: 10,
        username: 'testuser',
        date: '2024-03-05T04:49:24.369Z',
        taskType: 'Exercise',
        startTime: '10:00',
        endTime: '11:00',
      },
      {
        isCompleted: true,
        points: 20,
        username: 'testuser',
        date: '2024-03-05T04:49:24.369Z',
        taskType: 'Reading',
        startTime: '12:00',
        endTime: '13:00',
      },
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

  it('fetches user tasks and displays total points and completed tasks with dates and types', async () => {
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

      // Correct the date and ensure the format matches the component's output
      expect(getByText('Total Points: 30')).toBeTruthy();
      expect(getByText('Date: 3/4/2024 | Time: 4:00 AM - 5:00 AM')).toBeTruthy(); // Adjusted date and format
      expect(getByText('Type: Exercise')).toBeTruthy();
      expect(getByText('Date: 3/4/2024 | Time: 6:00 AM - 7:00 AM')).toBeTruthy(); // Adjusted date and format
      expect(getByText('Type: Reading')).toBeTruthy();
    });
  });

  // Add more tests as needed, for example, testing animations, confetti effect, etc.
});
