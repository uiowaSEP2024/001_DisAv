import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
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

  it('handles errors during task submission', async () => {
    axios.put.mockRejectedValue(new Error('An error occurred')); // Mock axios call to reject

    const { getByText } = render(
      <PaperProvider>
        <Home route={mockRoute} />
      </PaperProvider>
    );

    fireEvent.press(getByText(/Next/)); // Transition to task dialog

    await waitFor(() => {
      fireEvent.press(getByText(/Submit/)); // Press the submit button
      expect(axios.put).toHaveBeenCalled();
      // TODO: Make an error message on UI at this point and check here
    });
  });

  // Add more tests as needed
});
