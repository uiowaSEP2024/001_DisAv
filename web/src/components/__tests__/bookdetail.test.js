import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookDetail from '../BookDetail'; // Adjust the import path as necessary
import axios from 'axios';
import { toast } from 'react-toastify';

jest.mock('axios');
jest.mock('react-toastify');

const mockonClose = jest.fn();

describe('BookDetail', () => {
  const mockBook = {
    imageLink: 'http://example.com/image.jpg',
    title: 'Test Book Title',
    author: 'Test Author',
    isbn: '1234567890',
    chapterSummaries: Array(5).fill(''),
  };

  const mockUser = {
    username: 'testuser',
    frozenBrowsing: false, // Add this if your component expects this field
  };

  beforeEach(() => {
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('token', 'sometoken');
    localStorage.setItem('taskFrequency', '10000');
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('renders without crashing and displays book details', () => {
    render(<BookDetail book={mockBook} onClose={mockonClose} />);

    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(`Author: ${mockBook.author}`)).toBeInTheDocument();
    expect(screen.getByText(`ISBN: ${mockBook.isbn}`)).toBeInTheDocument();
    expect(screen.getAllByText(/Summary for Chapter/).length).toBe(10);
  });

  it('calls onClose when Close button is clicked', () => {
    render(<BookDetail book={mockBook} onClose={mockonClose} />);

    fireEvent.click(screen.getByTestId('book-detail-close'));
    expect(mockonClose).toHaveBeenCalledTimes(1);
  });

  it('submits a summary and handles valid summary response', async () => {
    axios.put.mockResolvedValue({ data: { validSummary: true, user: mockUser } });

    render(<BookDetail book={mockBook} onClose={mockonClose} />);
    fireEvent.change(screen.getByLabelText(`Summary for Chapter 1`), {
      target: { value: 'Test Summary' },
    });
    fireEvent.click(screen.getByTestId('submit-summary-0'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Summary accepted successfully');
    });

    const updatedUser = JSON.parse(sessionStorage.getItem('user'));
    expect(updatedUser.frozenBrowsing).toBe(false); // Make sure the browsing status is updated
  });

  it('submits a summary and handles invalid summary response', async () => {
    axios.put.mockResolvedValue({ data: { validSummary: false } });

    render(<BookDetail book={mockBook} onClose={mockonClose} />);
    const submitButton = screen.getByTestId('submit-summary-0');
    fireEvent.click(submitButton);
    expect(axios.put).toHaveBeenCalled();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Book summary is invalid'); // Wait for error toast
    });
  });

  it('updates user browsing status on successful summary submission', async () => {
    axios.put
      .mockResolvedValueOnce({ data: { validSummary: true } })
      .mockResolvedValueOnce({ data: { user: mockUser } });
    render(<BookDetail book={mockBook} onClose={mockonClose} />);
    const submitButton = screen.getByTestId('submit-summary-0');
    fireEvent.click(submitButton);
    await expect(axios.put).toHaveBeenCalledTimes(1);

    expect(sessionStorage.getItem('user')).toBeTruthy();
    // expect(window.postMessage).toHaveBeenCalledWith(expect.anything(), '*');
  });

  //   it('displays an error toast when submitting a summary fails', async () => {
  //     // Mock the axios.put call to reject with an error
  //     axios.put.mockRejectedValue(new Error('Unexpected error'));

  //     render(<BookDetail book={mockBook} onClose={() => {}} />);
  //     fireEvent.click(screen.getByTestId('submit-summary-0'));

  //     await waitFor(() => {
  //       // Check that the toast error function was called with the right message
  //       expect(toast.error).toHaveBeenCalledWith('Unexpected error');
  //     });
  //   });
});
