import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TasksScreen from '../../screens/Tasks';
import { Audio } from 'expo-av';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSession } from '../../context/SessionContext';

// Mock axios
jest.mock('axios');

// Mock the useSession hook
jest.mock('../../context/SessionContext', () => ({
  useSession: jest.fn(),
}));

// Mock expo-av Audio
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock response data for axios
const mockTasksData = {
  data: {
    tasks: [
      {
        _id: 'task1',
        taskType: 'Reading',
        isCompleted: false,
        startTime: '22:14:06',
        points: 10,
      },
    ],
  },
};

axios.get.mockResolvedValue(mockTasksData);

// Mock the api variable from the config file
jest.mock('../../config/Api', () => ({
  api: 'http://localhost:3002',
}));

describe('TasksScreen', () => {
  beforeEach(() => {
    // Reset mocks before each test
    axios.get.mockClear();
    mockNavigation.navigate.mockClear();
    Audio.Sound.createAsync.mockClear();

    // Set up the useSession mock return value
    useSession.mockReturnValue({
      user: {
        username: 'testuser',
        preferredTasks: ['Reading', 'Exercise'],
      },
    });
  });

  it('renders tasks and allows marking a task as completed', async () => {
    const { getByText, getByTestId } = render(
      <PaperProvider>
        <TasksScreen navigation={mockNavigation} />
      </PaperProvider>
    );

    // Wait for the tasks to be fetched and displayed
    await waitFor(() => {
      expect(getByText('Your Tasks')).toBeTruthy();
      expect(getByText('Reading')).toBeTruthy();
      expect(getByText('Start Time: 22:14:06')).toBeTruthy();
    });

    // Mock the response for marking a task as completed
    axios.put.mockResolvedValue({ data: { message: 'Task successfully updated' } });

    // Press the "Complete Task" button
    fireEvent.press(getByTestId('complete-task-button'));

    // Wait for the API call to complete
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
        username: 'testuser',
        id: 'task1',
        isCompleted: true,
      });
    });

    // Check if the task is removed from the screen or marked as completed
    // This depends on how your component handles the state update after task completion
    // For example:
    // await waitFor(() => {
    //   expect(queryByText('Reading')).toBeNull();
    // });
  });

  // Add more tests as needed, for example, testing sound playback, task creation, etc.
});
