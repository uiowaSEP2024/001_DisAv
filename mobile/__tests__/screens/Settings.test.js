import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Settings from '../../screens/Settings';
import axios from 'axios';

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
    const { getByText } = render(<Settings navigation={mockNavigation} />);
    expect(getByText('Settings')).toBeTruthy();
  });
  it('navigates to Preferences on button press', async () => {
    const { getByText } = render(<Settings navigation={mockNavigation} />);
    fireEvent.press(getByText('Update Preferences'));
    await waitFor(() => expect(mockNavigation.navigate).toHaveBeenCalledWith('Preferences'));
  });

  it('updates state on input change', () => {
    const { getByTestId } = render(<Settings navigation={mockNavigation} />);
    const usernameInput = getByTestId('username-input');
    fireEvent.changeText(usernameInput, 'newUsername');
    expect(usernameInput.props.value).toBe('newUsername');
  });

  it('submits updated information', async () => {
    axios.put.mockResolvedValue({ data: true }); // Mock axios response

    const { getByText } = render(<Settings navigation={mockNavigation} />);
    fireEvent.press(getByText('Update Information'));
    await waitFor(() => expect(mockSaveUser).toHaveBeenCalled());
  });
});
