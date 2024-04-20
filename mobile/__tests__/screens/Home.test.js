import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Home from '../../screens/Home';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock `useSession` at the top level but without specifying the implementation
jest.mock('../../context/SessionContext');

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

describe('Home', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders correctly with a user having preferred tasks', async () => {
    // Dynamically set the mock implementation for this test
    const useSessionMock = require('../../context/SessionContext').useSession;
    useSessionMock.mockImplementation(() => ({
      user: {
        username: 'testuser',
        email: 'test@gmail.com',
        password: 'testpassword',
        preferredTasks: { walk: true, pushups: false, jumpingJacks: false },
      },
    }));

    const { getByText, queryByText } = render(
      <PaperProvider>
        <Home navigation={mockNavigation} />
      </PaperProvider>
    );

    await waitFor(() => {
      expect(queryByText('Welcome')).toBeNull();
      expect(
        getByText(
          'InfiniteFocus is a revolutionary mobile app designed to combat digital distractions and promote productivity and mindfulness.'
        )
      ).toBeTruthy();
    });
  });

  it('shows the welcome dialog on first render when preferredTasks is empty', async () => {
    // Dynamically set the mock implementation for this test
    const useSessionMock = require('../../context/SessionContext').useSession;
    useSessionMock.mockImplementation(() => ({
      user: {
        username: 'testuser',
        email: 'test@gmail.com',
        password: 'testpassword',
        preferredTasks: {},
      },
    }));

    const { getByText, queryByText } = render(
      <PaperProvider>
        <Home navigation={mockNavigation} />
      </PaperProvider>
    );

    await waitFor(() => {
      expect(getByText('Welcome')).toBeTruthy();
    });

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(queryByText('Welcome')).toBeNull();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Preferences');
  });
});
