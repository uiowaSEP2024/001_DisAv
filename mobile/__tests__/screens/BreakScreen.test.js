import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BreakScreen from '../../screens/BreakScreen';
import { Audio } from 'expo-av';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContext } from '@react-navigation/native';

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
        // Ensure any other properties returned by createAsync are also mocked if used
      }),
    },
  },
}));

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

describe('BreakScreen', () => {
  beforeEach(() => {
    // Reset mocks before each test
    Audio.Sound.createAsync.mockClear();
    mockNavigation.navigate.mockClear();
    mockNavigation.goBack.mockClear();
  });

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

  it('sound is playing and navigates back when "Skip" button is pressed', async () => {
    const { getByText } = render(
      <PaperProvider>
        <NavigationContext.Provider value={mockNavigation}>
          <BreakScreen />
        </NavigationContext.Provider>
      </PaperProvider>
    );

    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    await waitFor(() => {
      // First, ensure createAsync was called
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  // TODO: Make sure sound stops playing when the screen is not focused
});
