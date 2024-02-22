import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Home from '../../screens/Home';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      // Add any other navigation functions that your tests rely on
    }),
    // Mock any other hooks or functions as needed
  };
});

// Mock the useSession hook before your describe block
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    login: jest.fn().mockImplementation(() => Promise.resolve(true)), // Mock implementation of login
    // Add other functions or values returned by useSession if necessary
    user: {
      username: 'testuser',
      email: 'test@gmail.com',
      password: 'testpassword',
      preferredTasks: [],
    },
  }),
}));

// Mock navigation and route props
const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    user: { id: '1', name: 'John Doe' }, // Adjust based on what your component expects
  },
};

describe('Home', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <PaperProvider>
        <Home navigation={mockNavigation} route={mockRoute} />
      </PaperProvider>
    );
    expect(
      getByText(
        'Welcome to infinite focus, an app that will enable you to avoid doom scrolling and enjoy the more important things in life'
      )
    ).toBeTruthy();
  });
  it('navigates opens the dialog on first render when preferredTasks is empty', async () => {
    const { getByText, queryByText } = render(
      <PaperProvider>
        <Home navigation={mockNavigation} route={mockRoute} />
      </PaperProvider>
    );

    // Check if the dialog is visible on the screen
    expect(getByText('Welcome')).toBeTruthy();

    // Check if the Next button is visible and clickable
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    // Wait for the dialog to be dismissed
    await waitFor(() => {
      expect(queryByText('Welcome')).toBeNull();
    });

    // Ensure navigation to 'Preferences' screen is triggered after pressing 'Next'
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Preferences');
  });
});
