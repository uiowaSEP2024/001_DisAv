import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

// Mock chrome API
jest.mock('../../__mocks__/chromeMock.js');

describe('App Component', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    chrome.storage.local.clear();
  });

  test('renders login button when not logged in', () => {
    render(<App />);
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('displays user info when logged in', async () => {
    // Preload storage with user info
    chrome.storage.local.set({
      user: { username: 'testuser', email: 'test@example.com' },
      token: '123456',
    }, () => {
      render(<App />);

    });
    await waitFor(() => screen.getByText('Log out'));

    expect(screen.getByText('User Name: testuser')).toBeInTheDocument();
    expect(screen.getByText('User Email: test@example.com')).toBeInTheDocument();
   expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  test('clears storage and user info on logout', async () => {
    // Mock logged in state
    chrome.storage.local.set({
      user: { username: 'testuser', email: 'test@example.com' },
      token: '123456',
    }, () => {
      const { getByText } = render(<App />);
      const logoutButton = getByText('Log out');
      fireEvent.click(logoutButton);
    });

    // Wait for async useEffect to resolve
    await waitFor(() => screen.getByText('Log in'));

    expect(chrome.storage.local.clear).toHaveBeenCalled();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });
});
