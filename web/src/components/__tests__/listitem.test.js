import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ListItem from '../ListItem';

describe('ListItem', () => {
  const mockAddBook = jest.fn();
  const bookProps = {
    title: 'Test Title',
    googleId: '123',
    image: 'http://example.com/image.jpg',
    description: 'Test Description',
    authors: ['Author 1'],
    categories: ['Category 1'],
    addBook: mockAddBook,
  };

  beforeEach(() => {
    mockAddBook.mockClear();
  });

  it('renders correctly', () => {
    const { getByText, getByAltText } = render(<ListItem {...bookProps} />);

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Author 1')).toBeInTheDocument(); // Depending on how you render arrays, this might need adjustment
    expect(getByText('Test Description')).toBeInTheDocument();
    expect(getByAltText('')).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  it('calls addBook on click with the right parameters', () => {
    const { getByText } = render(<ListItem {...bookProps} />);

    fireEvent.click(getByText('Test Title')); // You can also use getByTestId if you prefer or need more specificity
    expect(mockAddBook).toHaveBeenCalledWith({
      title: 'Test Title',
      googleId: '123',
      imageLink: 'http://example.com/image.jpg',
      description: 'Test Description',
      authors: ['Author 1'],
      categories: ['Category 1'],
    });
  });
});
