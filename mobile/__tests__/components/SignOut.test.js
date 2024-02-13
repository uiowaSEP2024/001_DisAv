import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignOut from '../../components/SignOut';

// Mocks
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    logout: jest.fn().mockImplementation(() => Promise.resolve()),
  }),
}));

describe('SignOut Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<SignOut />);
    expect(getByTestId('SignOut')).toBeTruthy();
  });

  it('opens modal on press and calls logout and navigates to Auth when confirmed', async () => {
    const { getByText, getByTestId } = render(<SignOut />);
    const { logout } = require('../../context/SessionContext').useSession();
    const { navigate } = require('@react-navigation/native').useNavigation();

    // Simulate pressing the initial "Sign Out" button to open the modal
    fireEvent.press(getByText('Sign Out'));

    // The modal should now be visible, so we can press the "Sign Out" button within the modal
    fireEvent.press(getByTestId('SignOutButton'));

    // Wait for the logout function to be called
    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));

    // Check if navigation was called with 'Auth'
    expect(navigate).toHaveBeenCalledWith('Auth');
  });
});
