import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Preferences from '../../screens/Preferences';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
  put: jest.fn(),
}));

// Mock the useSession hook
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    user: {
      preferredTasks: { work: false, read: true, exercise: false, rest: true },
    },
    saveUser: jest.fn().mockImplementation(() => Promise.resolve(true)),
  }),
}));

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};
// Mock response data for axios
const mockResponseData = {
  data: {
    user: {
      preferredTasks: { work: true, read: false, exercise: true, rest: false },
    },
  },
};

axios.put.mockImplementation(() => Promise.resolve(mockResponseData));

// Mock the api variable from the config file
jest.mock('../../config/Api', () => ({
  api: 'http://localhost:3002',
}));

describe('Preferences', () => {
  it('renders correctly with initial user preferences', () => {
    const { getByText } = render(<Preferences navigation={mockNavigation} />);
    expect(getByText('What kind of tasks do you want to do?')).toBeTruthy();
    // Check for task buttons based on the mocked user's preferred tasks
    expect(getByText('work')).toBeTruthy();
    expect(getByText('read')).toBeTruthy();
    expect(getByText('exercise')).toBeTruthy();
    expect(getByText('rest')).toBeTruthy();
  });

  it('updates user preferences on submit', async () => {
    const { getByText } = render(<Preferences navigation={mockNavigation} />);
    fireEvent.press(getByText('Submit'));

    // Mock axios call
    expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
      user: expect.objectContaining({
        preferredTasks: expect.any(Object),
      }),
    });

    // You can add more specific checks here if needed, e.g., checking the arguments passed to axios.put
  });

  // Add more tests as needed, for example, testing individual task selection toggles
});
