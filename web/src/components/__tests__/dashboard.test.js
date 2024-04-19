import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import axios from 'axios';

jest.mock('axios');

const consoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = consoleError;
});

beforeEach(() => {
  const user = {
    username: 'adnane',
    firstname: 'Adnane',
    lastname: 'Ezouhri',
    email: 'adnane@gmail.com',
  };
  sessionStorage.setItem('user', JSON.stringify(user));
  axios.get.mockResolvedValue({
    data: {
      user: {
        blacklistedWebsites: [],
        whitelistedWebsites: [],
      },
    },
  });
});

afterEach(() => {
  sessionStorage.clear();
});

test('fetches and displays blacklisted and whitelisted sites', async () => {
  render(<Dashboard />);

  await waitFor(() => {
    expect(screen.getByText('Blacklisted Sites')).toBeInTheDocument();
    expect(screen.getByText('Whitelisted Sites')).toBeInTheDocument();
  });
});

test('opens the dialog box to add a blacklisted site', () => {
  render(<Dashboard />);

  fireEvent.click(screen.getByText('Add Blacklisted Site'));

  // Verify the dialog box is now open
  // You'll need to adjust the query based on your dialog box content
  expect(screen.getByText('Site to Blacklist')).toBeInTheDocument();
});

test('opens the dialog box to add a whitelisted site', () => {
  render(<Dashboard />);

  fireEvent.click(screen.getByText('Add Whitelisted Site'));

  // Verify the dialog box is now open
  expect(screen.getByText('Site to Whitelist')).toBeInTheDocument();
});

test('adds a blacklisted site', async () => {
  axios.put.mockResolvedValueOnce({}); // Mock the API call for adding a site

  render(<Dashboard />);

  fireEvent.click(screen.getByText('Add Blacklisted Site'));

  // You'll need to adjust the query based on your dialog box content
  fireEvent.change(screen.getByPlaceholderText('Enter website URL'), {
    target: { value: 'www.new-blacklisted-site.com' },
  });

  await waitFor(() => {
    expect(screen.getByPlaceholderText('Enter website URL').value).toBe(
      'www.new-blacklisted-site.com'
    );
  });

  fireEvent.click(screen.getByText('Add'));
  //fireEvent.click(screen.getByText('Close'));

  // Verify the API was called and the new site is displayed
  await waitFor(() => {
    expect(axios.put).toHaveBeenCalled();
    expect(screen.getByText('www.new-blacklisted-site.com')).toBeInTheDocument();
  });
});

test('removes a blacklisted site', async () => {
  axios.put.mockResolvedValueOnce({}); // Mock the API call for removing a site
  axios.get.mockResolvedValue({
    data: {
      user: {
        blacklistedWebsites: ['www.new-blacklisted-site.com'],
        whitelistedWebsites: [],
      },
    },
  });
  render(<Dashboard />);

  // Wait for blacklisted sites to be loaded
  await waitFor(() => {
    expect(screen.getByText('www.new-blacklisted-site.com')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Remove')); // This assumes your remove button has "Remove" text

  // Verify the API was called and the site is no longer displayed
  await waitFor(() => {
    expect(axios.put).toHaveBeenCalled();
    expect(screen.queryByText('www.new-blacklisted-site.com')).not.toBeInTheDocument();
  });
});

test('adds a whitelisted site', async () => {
  axios.put.mockResolvedValueOnce({}); // Mock the API call for adding a site

  render(<Dashboard />);

  fireEvent.click(screen.getByText('Add Whitelisted Site'));

  // You'll need to adjust the query based on your dialog box content
  fireEvent.change(screen.getByPlaceholderText('Enter website URL'), {
    target: { value: 'www.new-whitelisted-site.com' },
  });
  fireEvent.click(screen.getByText('Add'));

  // Verify the API was called and the new site is displayed
  await waitFor(() => {
    expect(axios.put).toHaveBeenCalled();
    expect(screen.getByText('www.new-whitelisted-site.com')).toBeInTheDocument();
  });
});

test('removes a whitelisted site', async () => {
  axios.put.mockResolvedValueOnce({}); // Mock the API call for removing a site
  axios.get.mockResolvedValue({
    data: {
      user: {
        blacklistedWebsites: [],
        whitelistedWebsites: ['www.new-whitelisted-site.com'],
      },
    },
  });
  render(<Dashboard />);

  // Wait for blacklisted sites to be loaded
  await waitFor(() => {
    expect(screen.getByText('www.new-whitelisted-site.com')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Remove')); // This assumes your remove button has "Remove" text

  // Verify the API was called and the site is no longer displayed
  await waitFor(() => {
    expect(axios.put).toHaveBeenCalled();
    expect(screen.queryByText('www.new-whitelisted-site.com')).not.toBeInTheDocument();
  });
});

test('displays a message when no sites are being tracked', async () => {
  axios.get.mockResolvedValue({
    data: {
      user: {
        blacklistedWebsites: [],
        whitelistedWebsites: [],
      },
    },
  });
  render(<Dashboard />);

  await waitFor(() => {
    expect(screen.getAllByText('No sites are currently being tracked.')).toHaveLength(2);
  });
});

describe('Dashboard error handling', () => {
  beforeEach(() => {
    const user = {
      username: 'adnane',
      firstname: 'Adnane',
      lastname: 'Ezouhri',
      email: 'adnane@gmail.com',
    };
    sessionStorage.setItem('user', JSON.stringify(user));
  });

  it('handles errors when adding a site fails', async () => {
    const errorMessage = 'Network Error';
    axios.put.mockRejectedValueOnce(new Error(errorMessage));

    render(<Dashboard />);
    fireEvent.click(screen.getByText('Add Blacklisted Site'));

    // Wait for the DialogBox to appear
    const dialogInput = await screen.findByPlaceholderText('Enter website URL');
    fireEvent.change(dialogInput, { target: { value: 'www.testsite.com' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => expect(axios.put).toHaveBeenCalled());

    // No specific UI element to assert the error, but we can check console.error
    expect(console.error).toHaveBeenCalledWith(
      'Failed to update preferences:',
      new Error(errorMessage) // Match the actual error object passed to console.error
    );
  });

  it('handles errors when removing a site fails', async () => {
    const errorMessage = 'Network Error on delete';
    axios.put.mockRejectedValueOnce(new Error(errorMessage));

    // Mock initial sites load
    axios.get.mockResolvedValueOnce({
      data: {
        user: {
          blacklistedWebsites: ['www.testsite.com'],
          whitelistedWebsites: ['www.othersite.com'],
        },
      },
    });

    render(<Dashboard />);

    // Wait for the site to be rendered and trigger the delete
    await waitFor(() => expect(screen.getByText('www.testsite.com')).toBeInTheDocument());

    fireEvent.click(screen.getAllByText('Remove')[0]);

    await waitFor(() => expect(axios.put).toHaveBeenCalled());

    // No specific UI element to assert the error, but we can check console.error
    expect(console.error).toHaveBeenCalledWith(
      'Failed to update preferences:',
      new Error(errorMessage) // Match the actual error object passed to console.error
    );
  });
});
