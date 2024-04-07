import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import DialogBox from '../DialogBox';
import axios from 'axios';

jest.mock('axios');

const mockedBooksData = {
    data: {
        books: [
            {
                title: 'Book Title 1',
                imageLinks: { thumbnail: 'http://example.com/image1.jpg' },
                authors: ['Author 1'],
                description: 'Description 1',
                categories: ['Category 1'],
                googleId: '1',
            },
            {
                title: 'Book Title 2',
                imageLinks: { thumbnail: 'http://example.com/image2.jpg' },
                authors: ['Author 2'],
                description: 'Description 2',
                categories: ['Category 2'],
                googleId: '2',
            },
        ],
    },
};

describe('DialogBox', () => {
    it('should not render when isOpen is false', () => {
        const { queryByText } = render(<DialogBox isOpen={false} onClose={() => { }} addBook={() => { }} />);
        expect(queryByText(/enter book title/i)).not.toBeInTheDocument();
    });

    it('renders and can interact with input, closing, and loading books', async () => {
        axios.get.mockResolvedValueOnce(mockedBooksData);

        const onCloseMock = jest.fn();
        const addBookMock = jest.fn();

        const { getByPlaceholderText, getByText, queryByText } = render(
            <DialogBox isOpen={true} onClose={onCloseMock} addBook={addBookMock} />
        );

        fireEvent.change(getByPlaceholderText(/book title/i), { target: { value: 'test' } });

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Since each book has unique title, author, and description, you can use those for querying.
        expect(queryByText('Book Title 1')).toBeInTheDocument();
        expect(queryByText('Author 1')).toBeInTheDocument();
        expect(queryByText('Description 1')).toBeInTheDocument();

        expect(queryByText('Book Title 2')).toBeInTheDocument();
        expect(queryByText('Author 2')).toBeInTheDocument();
        expect(queryByText('Description 2')).toBeInTheDocument();

        fireEvent.click(getByText(/close/i));
        expect(onCloseMock).toHaveBeenCalled();
    });
});
