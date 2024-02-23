import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Settings from '../../screens/Settings';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';

// Mock the useNavigation hook from @react-navigation/native
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

jest.mock('axios');

const mockSaveUser = jest.fn().mockImplementation(() => Promise.resolve(true));

// Mock the useSession hook before your describe block
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    login: jest.fn().mockImplementation(() => Promise.resolve(true)), // Mock implementation of login
    user: {
      username: 'testuser',
      email: 'test@gmail.com',
      password: 'testpassword',
    },
    saveUser: mockSaveUser,
  }),
}));

describe('Settings Screen', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />
      </PaperProvider>
    );
    expect(getByText('Settings')).toBeTruthy();
    expect(getByTestId('username-input')).toBeTruthy();
  });

  it('handles input change', () => {
    const { getByTestId } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />{' '}
      </PaperProvider>
    );
    const usernameInput = getByTestId('username-input');
    fireEvent.changeText(usernameInput, 'newUsername');
    expect(usernameInput.props.value).toBe('newUsername');
  });

  it('submits updated information', async () => {
    axios.put.mockResolvedValue({ data: true });
    const { getByText } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />{' '}
      </PaperProvider>
    );
    fireEvent.press(getByText('Update Information'));
    await waitFor(() => expect(axios.put).toHaveBeenCalled());
  });

  it('navigates to Preferences on button press', () => {
    const { getByText } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />{' '}
      </PaperProvider>
    );
    fireEvent.press(getByText('Update Preferences'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Preferences');
  });

  it('confirms and deletes account on button press', async () => {
    axios.delete.mockResolvedValue({ status: 200 });

    const { getByText } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />
      </PaperProvider>
    );

    // Trigger the delete account process
    fireEvent.press(getByText('Delete Account'));

    // Since CustomAlert uses buttons, you can directly press the "Delete" button
    // Assuming 'Delete' is the text on the button for confirming account deletion
    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);

    // Wait for the axios.delete call to be made
    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith(expect.anything(), { data: { userId: undefined } })
    );

    // Optionally, verify that the user is logged out and navigated to the login screen
    // TODO: Implement logout function in the SessionContext after backend is ready
    // expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});
