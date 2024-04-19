import React from 'react';
import { render, fireEvent, act, waitFor, cleanup } from '@testing-library/react-native';
import BreakScreen from '../../screens/BreakScreen';
import { Audio } from 'expo-av';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContext } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Mock axios
jest.mock('axios');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock useIsFocused to simulate screen focus
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: jest.fn(() => true),
  };
});

// Mock SessionContext
const mockSetCurrentTask = jest.fn();
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    currentTask: { _id: '123', name: 'Test Task' },
    setCurrentTask: mockSetCurrentTask,
  }),
}));

describe('BreakScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock implementations
    axios.put.mockResolvedValue({ data: {} });
    AsyncStorage.removeItem.mockResolvedValue();
    Audio.Sound.createAsync.mockResolvedValue({
      sound: {
        playAsync: jest.fn().mockResolvedValue(),
        unloadAsync: jest.fn().mockResolvedValue(),
      },
    });
  });

  afterEach(cleanup);

  it('plays sound when the screen is focused', async () => {
    render(
      <PaperProvider>
        <NavigationContext.Provider value={mockNavigation}>
          <BreakScreen />
        </NavigationContext.Provider>
      </PaperProvider>
    );

    await waitFor(() => {
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
    });
  });

  it('navigates back when "Skip" button is pressed', async () => {
    const { getByText } = render(
      <PaperProvider>
        <NavigationContext.Provider value={mockNavigation}>
          <BreakScreen />
        </NavigationContext.Provider>
      </PaperProvider>
    );
    await act(async () => {
      fireEvent.press(getByText('Skip Break'));
    });

    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('completes the current task and shows alert', async () => {
    const { getByText } = render(
      <PaperProvider>
        <NavigationContext.Provider value={mockNavigation}>
          <BreakScreen />
        </NavigationContext.Provider>
      </PaperProvider>
    );
    await act(async () => {
      fireEvent.press(getByText('Skip Break'));
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
        id: '123',
        isCompleted: true,
      });
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('currentTask');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('selectedExercise');
      expect(mockSetCurrentTask).toHaveBeenCalledWith(null);
    });
  });

  it('renders relaxation message when there is no current task', async () => {
    jest.mock('../../context/SessionContext', () => ({
      useSession: () => ({
        currentTask: null,
        setCurrentTask: jest.fn(),
      }),
    }));

    await act(async () => {
      const { getByText } = render(
        <PaperProvider>
          <NavigationContext.Provider value={mockNavigation}>
            <BreakScreen />
          </NavigationContext.Provider>
        </PaperProvider>
      );

      expect(
        getByText('You don`t have any incomplete tasks, but stay for relaxation if you wish!')
      ).toBeTruthy();
    });
  });
});
