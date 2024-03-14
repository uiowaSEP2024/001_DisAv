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

// Mock the expo-av module
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn(),
          unloadAsync: jest.fn(),
        },
      }),
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
        _id: '1',
        taskType: 'Reading',
        isCompleted: false,
        startTime: '22:14:06',
        endTime: '23:14:10',
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

// Mock useIsFocused to simulate screen focus
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: jest.fn(() => true),
  };
});

describe('TasksScreen', () => {
  beforeEach(() => {
    // Reset mocks before each test
    axios.get.mockClear();
    axios.post.mockClear();
    axios.put.mockClear();
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

  it('fetches tasks successfully and displays the active task', async () => {
    axios.get.mockResolvedValue({
      data: { tasks: [{ _id: '1', taskType: 'Exercise', isCompleted: false, startTime: '10:00' }] },
    });

    useSession.mockReturnValue({
      user: { username: 'testuser', preferredTasks: ['Exercise', 'Reading'] },
    });

    const { getByText } = render(
      <PaperProvider>
        <TasksScreen />
      </PaperProvider>
    );

    await waitFor(() => {
      expect(getByText('Exercise')).toBeTruthy();
      expect(getByText('Start Time: 10:00')).toBeTruthy();
    });
  });

  it('fetches tasks successfully and displays the active task', async () => {
    axios.get.mockResolvedValue({
      data: { tasks: [{ _id: '1', taskType: 'Exercise', isCompleted: false, startTime: '10:00' }] },
    });

    useSession.mockReturnValue({
      user: { username: 'testuser', preferredTasks: ['Exercise', 'Reading'] },
    });

    const { getByText } = render(
      <PaperProvider>
        <TasksScreen />
      </PaperProvider>
    );

    await waitFor(() => {
      expect(getByText('Exercise')).toBeTruthy();
      expect(getByText('Start Time: 10:00')).toBeTruthy();
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
      expect(getByText('Exercise')).toBeTruthy();
      expect(getByText('Start Time: 10:00')).toBeTruthy();
    });

    // Mock the response for marking a task as completed
    axios.put.mockResolvedValue({ data: { message: 'Task successfully updated' } });

    // Press the "Complete Task" button
    fireEvent.press(getByTestId('complete-task-button'));

    // Wait for the API call to complete
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
        username: 'testuser',
        id: '1',
        isCompleted: true,
        endTime: expect.any(String),
      });
    });
  });

  it('handles errors when fetching tasks fails', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch tasks'));

    // Assuming your component shows an alert or logs an error
    console.error = jest.fn();

    render(
      <PaperProvider>
        <TasksScreen />
      </PaperProvider>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to fetch tasks:', expect.any(Error));
    });
  });

  it('plays sound for the active task', async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [{ _id: '1', taskType: 'Exercise', isCompleted: false, startTime: '10:00' }],
      },
    });

    Audio.Sound.createAsync.mockResolvedValue({ sound: { playAsync: jest.fn() } });

    render(
      <PaperProvider>
        <TasksScreen />
      </PaperProvider>
    );

    await waitFor(() => {
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
    });
  });

  it('marks a task as completed and sound plays', async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [
          {
            _id: '1',
            taskType: 'Exercise',
            isCompleted: false,
            startTime: '10:00',
            points: 10,
            endTime: '11:00',
          },
        ],
      },
    });
    axios.put.mockResolvedValue({ data: { message: 'Task successfully updated' } });

    const { getByTestId } = render(
      <PaperProvider>
        <TasksScreen />
      </PaperProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByTestId('complete-task-button'));
    });

    await waitFor(() => {
      // Ensure createAsync was called
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
      expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
        username: 'testuser',
        id: '1',
        isCompleted: true,
        endTime: expect.any(String),
      });
    });
  });
  it('creates a random task for the user when no active tasks are found', async () => {
    // Adjust this test to check for task creation if no active tasks are found
    axios.get.mockResolvedValueOnce({ data: { tasks: [] } }); // Simulate no active tasks
    axios.post.mockResolvedValueOnce({ data: { message: 'Task successfully created' } }); // Simulate task creation success

    render(
      <PaperProvider>
        <TasksScreen />
      </PaperProvider>
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          username: 'testuser',
          taskType: expect.any(String), // You might want to be more specific based on your logic
        })
      );
    });
  });
  // TODO: Make sure sound stops playing when the screen is not focused
});
