import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import ReadTask from '../ReadTask';

// Mock axios and sessionStorage
jest.mock('axios');
const mockSessionStorage = user => {
  const mockUser = JSON.stringify(user);
  Storage.prototype.getItem = jest.fn(() => mockUser);
};

describe('ReadTask', () => {
  beforeEach(() => {
    mockSessionStorage({ username: 'testUser' });
    axios.get.mockResolvedValue({
      data: { books: [{ title: 'Test Book', imageLink: 'test-link', completionPercentage: 50 }] },
    });
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ReadTask />
      </MemoryRouter>
    );
  });

  it('fetches books and displays them', async () => {
    render(
      <MemoryRouter>
        <ReadTask />
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
        params: { username: 'testUser' },
      })
    );
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('handles errors in fetching books', async () => {
    axios.get.mockRejectedValue(new Error('Error fetching books'));
    render(
      <MemoryRouter>
        <ReadTask />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });
});
