import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Preferences from '../../screens/Preferences';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';

// Mock the useSession hook
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    user: {
      username: 'testuser',
      preferredTasks: { Work: false, Reading: true, Exercise: false, Break: true },
      taskFrequency: 7200000, // 2 hours in milliseconds
      workPreferences: '',
      readingPreferences: '',
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
      Work: false,
      Reading: true,
      Exercise: false,
      Break: true,
    },
  },
};

axios.put.mockImplementation(() => Promise.resolve(mockResponseData));

// Mock the api variable from the config file
jest.mock('../../config/Api', () => ({
  api: 'localhost:3002',
}));

describe('Preferences', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks(); // Clears any mocks to prevent leakage between tests
    // Add any other cleanup code here
  });

  it('renders correctly with initial user preferences', async () => {
    const { getByText, getByTestId } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    await waitFor(() => {
      expect(getByText('What are your preferred tasks?')).toBeTruthy();
      // Check for task buttons based on the mocked user's preferred tasks
      expect(getByTestId('work-checkbox')).toBeTruthy();
      expect(getByTestId('reading-checkbox')).toBeTruthy();
      expect(getByTestId('exercise-checkbox')).toBeTruthy();
      expect(getByTestId('break-checkbox')).toBeTruthy();
    });
  });

  it('allows submission of updated preferences', async () => {
    const { getByTestId, getByText } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    // Simulate user interactions
    fireEvent.press(getByTestId('work-checkbox')); // Toggle work preference
    fireEvent.press(getByTestId('next-button')); // Proceed to next screen

    // Fill in the work description
    fireEvent.changeText(getByTestId('work-description-input'), 'Software Development');

    // Select task frequency
    fireEvent(getByTestId('hours-picker'), 'onValueChange', '2');
    fireEvent(getByTestId('minutes-picker'), 'onValueChange', '30');

    // Submit the form
    fireEvent.press(getByText('Submit'));

    // Assertions
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(4);
    });
  });

  // Test toggling task preferences and showing/hiding description inputs
  it('toggles task preferences and shows/hides description inputs accordingly', async () => {
    const { getByTestId, queryByTestId } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    fireEvent.press(getByTestId('work-checkbox'));

    fireEvent.press(getByTestId('next-button'));

    await waitFor(() => {
      expect(queryByTestId('work-description-input')).toBeTruthy();
    });

    fireEvent.press(getByTestId('reading-checkbox'));
    await waitFor(() => {
      expect(queryByTestId('reading-description-input')).toBeTruthy();
    });
  });

  // Add more tests to cover other user interactions ander other user interactions and error handling scenarios. This will help ensure comprehensive coverage of your component's functionality.

  // Test error handling for API failures
  it('shows an error message if the preferences submission fails', async () => {
    axios.put.mockImplementationOnce(() => Promise.reject(new Error('Failed to save preferences')));

    const { getByTestId, getByText, queryByText } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    // Trigger preferences submission
    fireEvent.press(getByTestId('work-checkbox')); // Toggle work preference
    fireEvent.press(getByTestId('next-button')); // Proceed to next screen
    fireEvent.changeText(getByTestId('work-description-input'), 'Software Development');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(queryByText('Failed to save preferences')).toBeTruthy();
    });
  });

  // Test navigation back after successful submission
  it('navigates back after successful preferences submission', async () => {
    const { getByTestId, getByText } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    // Simulate user interactions for a successful submission
    fireEvent.press(getByTestId('work-checkbox'));
    fireEvent.press(getByTestId('next-button'));
    fireEvent.changeText(getByTestId('work-description-input'), 'Software Development');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  // Test updating task frequency
  it('updates task frequency correctly', async () => {
    const { getByTestId, getByText } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    fireEvent.press(getByTestId('next-button')); // Proceed to task frequency screen
    fireEvent(getByTestId('hours-picker'), 'onValueChange', '1');
    fireEvent(getByTestId('minutes-picker'), 'onValueChange', '30');

    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      // Check the specific call for updating task frequency
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3002/user/update-preferred-tasks', // Adjust URL as necessary
        expect.objectContaining({
          username: 'testuser',
          preferredTasks: expect.any(Object),
        })
      );
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3002/user/update-task-frequency', // Adjust URL as necessary
        expect.objectContaining({
          taskFrequency: 5400000, // 1.5 hours in milliseconds
          username: 'testuser',
        })
      );
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3002/user/update-work-preferences', // Adjust URL as necessary
        expect.objectContaining({
          username: 'testuser',
          workPreferences: expect.any(String),
        })
      );
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3002/user/update-reading-preferences', // Adjust URL as necessary
        expect.objectContaining({
          username: 'testuser',
          readingPreferences: expect.any(String),
        })
      );
    });
  });

  // Ensure to cover all interactive elements and scenarios in your component to achieve high test coverage.
});
