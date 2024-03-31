import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BookDetail from '../BookDetail';

describe('BookDetail', () => {
    const mockBook = {
        imageLink: 'testImageLink',
        title: 'testTitle',
        author: 'testAuthor',
        isbn: 'testIsbn',
    };

    const mockOnClose = jest.fn();

    it('renders correctly', () => {
        const { getByText, getByLabelText } = render(<BookDetail book={mockBook} onClose={mockOnClose} />);

        expect(getByText('testTitle')).toBeInTheDocument();
        expect(getByText('Author: testAuthor')).toBeInTheDocument();
        expect(getByText('ISBN: testIsbn')).toBeInTheDocument();
    });

    it('handles summary change', () => {
        const { getByLabelText } = render(<BookDetail book={mockBook} onClose={mockOnClose} />);
        const input = getByLabelText('Summary for Chapter 1');

        fireEvent.change(input, { target: { value: 'Test summary' } });
        expect(input.value).toBe('Test summary');
    });

    it('calls onClose when close button is clicked', () => {
        const { getByText } = render(<BookDetail book={mockBook} onClose={mockOnClose} />);
        const button = getByText('Close');

        fireEvent.click(button);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles summary change and submission', () => {
        const { getByLabelText, getByTestId } = render(<BookDetail book={mockBook} onClose={mockOnClose} />);
        const input = getByLabelText('Summary for Chapter 1');
        const button = getByTestId('submit-summary-0');

        // Simulate change event on the summary input field
        fireEvent.change(input, { target: { value: 'Test summary' } });
        expect(input.value).toBe('Test summary');

        // Simulate click event on the submit button
        fireEvent.click(button);
        // Here you can add assertions to check the effect of the submit action
        // For example, if it's supposed to clear the input field:
        // expect(input.value).toBe('');
    });
});
