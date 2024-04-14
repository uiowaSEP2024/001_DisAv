import React from 'react';
import { render, fireEvent, waitFor, getByPlaceholderText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import ReadTask from '../ReadTask';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

// Mocks for localStorage
const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key]),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: () => {
            store = {};
        },
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

describe('ReadTask Component Tests', () => {
    beforeEach(() => {
        // Reset localStorage
        jest.useFakeTimers();
        mockLocalStorage.clear();
        mockLocalStorage.getItem.mockImplementation((key) => {
            if (key === 'username') return 'testUser';
            return null;
        });
        mockLocalStorage.setItem('username', 'testUser'); // Setting username before each test

        axios.get.mockImplementation((url, { params }) => {
            if (url.includes('/user/get-by-username')) {
                return Promise.resolve({
                    data: {
                        user: { username: params.username, frozenBrowsing: false }
                    }
                });
            }
            if (url.includes('/book/get-by-username')) {
                return Promise.resolve({
                    data: {
                        books: [{ id: '1', title: 'Test Book', imageLink: 'test.jpg', completionPercentage: 50 }]
                    }
                });
            }
            return Promise.reject(new Error('not found'));
        });

        axios.post.mockResolvedValue({
            data: { message: 'Book added successfully' }
        });
    });

    afterEach(() => {
        jest.runOnlyPendingTimers(); // Clear all timers after each test
        jest.useRealTimers(); // Switch back to real timers
    });

    it('should render the component and fetch user data', async () => {
        const { findByText } = render(<MemoryRouter><ReadTask /></MemoryRouter>);
        const heading = await findByText('Reading Task');
        expect(heading).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith('http://localhost:3002/user/get-by-username', {
            params: { username: 'testUser' },
        });
    });

    it('should handle book selection and detail display', async () => {
        const { findByText, getAllByRole } = render(<MemoryRouter><ReadTask /></MemoryRouter>);
        const bookCards = await waitFor(() => getAllByRole('button'));
        fireEvent.click(bookCards[0]); // Click on the first book card
        const bookDetail = await findByText('Test Book');
        expect(bookDetail).toBeInTheDocument();
    });

    it('should handle dialog open and close', async () => {
        const { findByText, getByText } = render(<MemoryRouter><ReadTask /></MemoryRouter>);
        const addButton = await findByText('Add a new Book');
        fireEvent.click(addButton);
        const dialogTitle = await findByText('Enter book title');
        expect(dialogTitle).toBeInTheDocument();

        const closeButton = getByText('Close');
        fireEvent.click(closeButton);
        expect(dialogTitle).not.toBeInTheDocument();
    });



    //   it('should show and hide notification', async () => {
    //     const { getByText, findByText, queryByText, getByPlaceholderText } = render(<MemoryRouter><ReadTask /></MemoryRouter>);
    //     const addButton = await findByText('Add a new Book');
    //     fireEvent.click(addButton);
    //     await findByText('Enter book title'); // Wait for the dialog to appear

    //     await act(async () => {
    //         fireEvent.change(getByPlaceholderText('Book Title'), { target: { value: 'New Book' } });
    //         fireEvent.click(getByText('Submit Book'));
    //       });


    //     await waitFor(() => {
    //       expect(getByText('Book was added successfully!')).toBeInTheDocument();
    //     });

    //     //Fast-forward time by 3.5 seconds to simulate the notification hiding
    //     act(() => {
    //       jest.advanceTimersByTime(3500);
    //     });

    //     await waitFor(() => {
    //       expect(queryByText('Book was added successfully!')).toBeNull();
    //     });
    //   });
});
