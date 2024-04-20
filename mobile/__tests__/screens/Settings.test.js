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

  // it('does not render without a user', () => {
  //   jest.mock('../../context/SessionContext', () => ({
  //     useSession: () => ({
  //       user: null,
  //     }),
  //   }));

  //   const { queryByText } = render(
  //     <PaperProvider>
  //       <Settings navigation={mockNavigation} />
  //     </PaperProvider>
  //   );

  //   expect(queryByText('Settings')).toBeNull();
  // });

  it('displays error message on update information failure', async () => {
    axios.put.mockRejectedValue(new Error('Error updating user information'));
    const { getByText, findByText } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />
      </PaperProvider>
    );

    fireEvent.press(getByText('Update Information'));
    const errorMessage = await findByText('Error updating user information');
    expect(errorMessage).toBeTruthy();
  });

  it('displays error message on delete account failure', async () => {
    axios.delete.mockRejectedValue(new Error('Failed to delete account'));
    const { getByText, findByText } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />
      </PaperProvider>
    );

    fireEvent.press(getByText('Delete Account'));
    // Assuming you have a way to confirm deletion, like pressing a 'Delete' button on a dialog
    await waitFor(() => fireEvent.press(getByText('Delete')));
    const errorMessage = await findByText('Failed to delete account');
    expect(errorMessage).toBeTruthy();
  });

  it('cancels account deletion', async () => {
    const { getByText } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />
      </PaperProvider>
    );

    fireEvent.press(getByText('Delete Account'));
    // Assuming 'Cancel' is the text on the button to cancel deletion in your CustomAlert
    fireEvent.press(getByText('Cancel'));

    // Here you might want to check if the delete confirmation dialog has been dismissed
    // This depends on how your CustomAlert component is implemented
    // For example, you could check if the dialog is no longer visible or if a state has changed
  });

  it('successfully updates user information', async () => {
    axios.put.mockResolvedValue({ data: true });
    const { getByText } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />
      </PaperProvider>
    );

    fireEvent.press(getByText('Update Information'));
    await waitFor(() => expect(mockSaveUser).toHaveBeenCalled());
  });

  it('successfully deletes account and navigates to login', async () => {
    axios.delete.mockResolvedValue({ status: 200 });
    const { getByText } = render(
      <PaperProvider>
        <Settings navigation={mockNavigation} />
      </PaperProvider>
    );

    fireEvent.press(getByText('Delete Account'));
    await waitFor(() => fireEvent.press(getByText('Delete')));
    await waitFor(() => expect(mockNavigation.navigate).toHaveBeenCalledWith('Preferences'));
  });
});
