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
          // Mock other methods you use from the sound object as needed
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

    // Mock response data for axios to return a Reading task
    axios.get.mockResolvedValue({
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

  it('marks a task as completed', async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [{ _id: '1', taskType: 'Exercise', isCompleted: false, startTime: '10:00' }],
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
      expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
        username: 'testuser',
        id: '1',
        isCompleted: true,
      });
    });
  });
});
