import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import { timeDifference, clearStorage } from '../App';
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
  test('renders logout button when logged in', async () => {
    await chrome.storage.local.set({ user: { username: 'testUser' }, token: 'testToken' });

    setTimeout(() => {
      render(<App />);
      expect(screen.getByText('Log out')).toBeInTheDocument();
    }, 100); // Adjust the delay time as needed
  });
  test('logs out user and clears storage when logout button is clicked', async () => {
    await chrome.storage.local.set({ user: { username: 'testUser' }, token: 'testToken' });
    setTimeout(() => {
      render(<App />);
      const logoutButton = screen.getByText('Log out');
      fireEvent.click(logoutButton);
      // Check if user is logged out and storage is cleared
      expect(screen.getByText('Log in')).toBeInTheDocument();
      expect(chrome.storage.local.clear).toHaveBeenCalled();
    }, 100);
  });
  // describe('clearStorage function', () => {
  //   it('clears local storage when called', () => {
  //     clearStorage();
  //     expect(chrome.storage.local.clear).toHaveBeenCalled();
  //   });
  // });
});
// Import the function

describe('timeDifference function', () => {
  it('calculates time difference correctly when timeToCompare is in the future', () => {
    // Define the current time and a future time to compare
    const futureTime = new Date().getTime() + 3600000; // Assuming time to compare is 13:00:00 UTC

    // Call the function with the future time
    const result = timeDifference(futureTime);

    // Assert that the result matches the expected difference
    expect(Math.round(result / 100) * 100).toEqual(3600);
  });

  // Add more test cases as needed
});
