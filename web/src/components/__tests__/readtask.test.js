import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import ReadTask from '../ReadTask';

// Mock axios and sessionStorage
jest.mock('axios');
const mockSessionStorage = (user) => {
    const mockUser = JSON.stringify(user);
    Storage.prototype.getItem = jest.fn(() => mockUser);
};

describe('ReadTask', () => {

    beforeEach(() => {
        mockSessionStorage({ username: 'testUser' });
        axios.get.mockResolvedValue({ data: { books: [{ title: 'Test Book', imageLink: 'test-link', completionPercentage: 50 }] } });
        axios.get.mockResolvedValueOnce({
            data: { books: [{ id: '1', title: 'New Book', imageLink: 'test-link', completionPercentage: 0 }] }
        });
        axios.post.mockResolvedValue({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });



    it('renders without crashing', () => {
        render(
            <MemoryRouter>
                <ReadTask />
            </MemoryRouter>);
    });

    it('fetches books and displays them', async () => {
        render(<MemoryRouter><ReadTask /></MemoryRouter>);
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith(expect.any(String), { params: { username: 'testUser' } }));
        expect(screen.getByText('New Book')).toBeInTheDocument();
    });

    it('handles errors in fetching books', async () => {
        axios.get.mockRejectedValue(new Error('Error fetching books'));
        render(<MemoryRouter><ReadTask /></MemoryRouter>);
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    });

    it('opens dialog box when add book button is clicked', async () => {
        render(<MemoryRouter><ReadTask /></MemoryRouter>);
        fireEvent.click(screen.getByText('Add a new Book'));
        expect(screen.getByText('Enter book title')).toBeInTheDocument();
    });

    it('closes dialog box when close button is clicked', async () => {
        render(<MemoryRouter><ReadTask /></MemoryRouter>);
        fireEvent.click(screen.getByText('Add a new Book'));
        fireEvent.click(screen.getByText('Close'));
        expect(screen.queryByText('Enter book title')).not.toBeInTheDocument();
    });

    it('shows notification when a book is added', async () => {
        render(<MemoryRouter><ReadTask /></MemoryRouter>);

        fireEvent.click(screen.getByText('Add a new Book'));

        // Assuming a DialogBox opens and we can input a title to search for books
        // Simulate typing a book title
        fireEvent.change(screen.getByPlaceholderText('Book Title'), { target: { value: 'Test Book' } });

        // Assuming there's a delay for the search operation, we'll advance timers
        jest.advanceTimersByTime(500);

        // Assuming the book appears as a result of the search, and we simulate adding it
        // You might need to adjust this part depending on how your component actually renders the search results
        await waitFor(() => screen.getByText('Test Book')); // Adjust based on how the book is listed
        fireEvent.click(screen.getByText('Test Book'));

        // Advance timers to simulate the notification showing and hiding
        jest.advanceTimersByTime(300); // Wait for the notification to show up
        await waitFor(() => expect(screen.getByText('Book was added successfully!')).toBeInTheDocument());

        jest.advanceTimersByTime(5000); // Wait for the notification to hide
        await waitFor(() => expect(screen.queryByText('Book was added successfully!')).not.toBeInTheDocument());

    });

    it('open dialog box when a book is clicked', async () => {
        render(<MemoryRouter><ReadTask /></MemoryRouter>);
        fireEvent.click(screen.getByText('Add a new Book'));
        fireEvent.change(screen.getByPlaceholderText('Book Title'), { target: { value: 'New Book' } });
        jest.advanceTimersByTime(500);
        await waitFor(() => screen.getByText('New Book'));
        fireEvent.click(screen.getByText('New Book'));
        //expect BookDetail to be rendered
        expect(screen.getByText('Chapter 1')).toBeInTheDocument();
        console.log('ICI');
        screen.debug();

    });

    it('closes dialog box when a book is clicked', async () => {
        render(<MemoryRouter><ReadTask /></MemoryRouter>);
        fireEvent.click(screen.getByText('Add a new Book'));
        fireEvent.change(screen.getByPlaceholderText('Book Title'), { target: { value: 'New Book' } });
        jest.advanceTimersByTime(500);
        await waitFor(() => screen.getByText('New Book'));
        fireEvent.click(screen.getByText('New Book'));
        fireEvent.click(screen.getByTestId('book-detail-close'));
        expect(screen.queryByText('Chapter 1')).not.toBeInTheDocument();
    });

    it('handles errors in adding books', async () => {

        render(<MemoryRouter><ReadTask /></MemoryRouter>);
        axios.post.mockRejectedValue(new Error('Error adding book'));
        fireEvent.click(screen.getByText('Add a new Book'));
        fireEvent.change(screen.getByPlaceholderText('Book Title'), { target: { value: 'Test Book' } });
        jest.advanceTimersByTime(500);
        await waitFor(() => screen.getByText('Test Book'));
        fireEvent.click(screen.getByText('Test Book'));

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    });

});
