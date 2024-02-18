import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import Home from '../../screens/Home'; // Update this path
import { Provider as PaperProvider } from 'react-native-paper';

jest.mock('axios');

const mockRoute = {
  params: {
    user: { username: 'testUser' },
  },
};
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      dev: true, // Or false, depending on your testing needs
    },
    hostUri: 'http://192.168.0.113:3002',
  },
}));
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
jest.mock('react-native/Libraries/Animated/src/Animated', () => 'Animated');

describe('Home Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the welcome dialog initially', () => {
    const { getByText } = render(
      <PaperProvider>
        <Home route={mockRoute} />
      </PaperProvider>
    );
    expect(getByText(/welcome to infinite focus/i)).toBeTruthy();
  });

  it('allows navigating from welcome to task selection', async () => {
    const { getByText, queryByText, debug } = render(
      <PaperProvider>
        <Home route={mockRoute} />
      </PaperProvider>
    );
    fireEvent.press(getByText(/Next/));
    expect(queryByText(/welcome to infinite focus/i)).toBeNull();
    debug();
    await waitFor(() => expect(getByText(/What type of task would you like to do?/i)).toBeTruthy());
  });

  it('displays an alert with the ERROR message after a successful API call', async () => {
    axios.put.mockRejectedValue(new Error('An error occurred')); // Mock axios call to reject

    const { getByText } = render(
      <PaperProvider>
        <Home route={mockRoute} />
      </PaperProvider>
    );

    fireEvent.press(getByText(/Next/)); // Transition to task dialog

    await waitFor(() => {
      fireEvent.press(getByText(/Submit/));
    });

    await waitFor(() => expect(axios.put).toHaveBeenCalled());

    await waitFor(() => {
      expect(getByText('Error updating preferences')).toBeTruthy();
    });
  });

  it('displays an alert with the correct message after a successful API call', async () => {
    // Mock the API call
    const mockApiMessage = 'User updated with preferred tasks';
    axios.put.mockResolvedValue({ data: { message: mockApiMessage } });
    const { getByText } = render(
      <PaperProvider>
        <Home route={mockRoute} />
      </PaperProvider>
    );
    fireEvent.press(getByText(/Next/)); // Transition to task dialog

    await waitFor(() => {
      fireEvent.press(getByText(/Submit/));
    });

    await waitFor(() => expect(axios.put).toHaveBeenCalled());

    await waitFor(() => expect(getByText(mockApiMessage)).toBeTruthy());
  });

  it('hides the alert after a successful API call and timeout', async () => {
    jest.useFakeTimers();
    axios.put.mockResolvedValue({ data: { message: 'User updated with preferred tasks' } });

    const { getByText, queryByText } = render(
      <PaperProvider>
        <Home route={mockRoute} />
      </PaperProvider>
    );
    fireEvent.press(getByText(/Next/)); // Transition to task dialog

    // Assume 'Submit Button' triggers the API call
    await waitFor(() => {
      fireEvent.press(getByText(/Submit/));
    });

    // Fast-forward until all timers have been executed
    act(() => {
      jest.runAllTimers();
    });

    // Assertions here
    await waitFor(() => {
      expect(queryByText('User updated with preferred tasks')).toBeNull(); // Adjust based on how you show alerts
    });

    jest.useRealTimers();
  });

  it('hides the alert after a Failed API call and timeout', async () => {
    jest.useFakeTimers();
    axios.put.mockRejectedValue(new Error('Error updating preferences'));

    const { getByText, queryByText } = render(
      <PaperProvider>
        <Home route={mockRoute} />
      </PaperProvider>
    );

    fireEvent.press(getByText(/Next/)); // Transition to task dialog

    // Assume 'Submit Button' triggers the API call
    await waitFor(() => {
      fireEvent.press(getByText(/Submit/));
    });
    // Fast-forward until all timers have been executed
    act(() => {
      jest.runAllTimers();
    });

    // Assertions here
    await waitFor(() => {
      expect(queryByText('Error updating preferences')).toBeNull(); // Adjust based on how you show alerts
    });

    jest.useRealTimers();
  });
});

describe('Home Screen Dialogs', () => {
  it('should initially display the welcome dialog', () => {
    const { getByText } = render(
      <PaperProvider>
        <Home route={mockRoute} />
      </PaperProvider>
    );
    expect(
      getByText(
        'Welcome to infinite focus, an app that will enable you to avoid doom scrolling and enjoy the more important things in life'
      )
    ).toBeTruthy();
  });

  it('should hide the welcome dialog and show the task type dialog after pressing Next', async () => {
    const { getByText, queryByText, debug } = render(
      <PaperProvider>
        <Home route={mockRoute} />
      </PaperProvider>
    );
    fireEvent.press(getByText('Next'));
    await waitFor(() =>
      expect(
        queryByText(
          'Welcome to infinite focus, an app that will enable you to avoid doom scrolling and enjoy the more important things in life'
        )
      ).toBeNull()
    );
    await waitFor(() => expect(getByText('What type of task would you like to do?')).toBeTruthy());
    await waitFor(() => {
      fireEvent.press(getByText(/Submit/));
    });
    debug();
  });
});
