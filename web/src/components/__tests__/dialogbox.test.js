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
    const { queryByText } = render(
      <DialogBox isOpen={false} onClose={() => {}} addBook={() => {}} />
    );
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

  it('renders when isOpen is true and has the correct title', () => {
    const { queryByText } = render(
      <DialogBox
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        title="Add Site"
        dashboard={true}
      />
    );
    expect(queryByText(/add site/i)).toBeInTheDocument();
  });

  it('calls onSave with the correct text when the add button is clicked', () => {
    const onSaveMock = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <DialogBox
        isOpen={true}
        onClose={() => {}}
        onSave={onSaveMock}
        title="Add Site"
        dashboard={true}
      />
    );

    fireEvent.change(getByPlaceholderText(/enter website url/i), {
      target: { value: 'www.example.com' },
    });
    fireEvent.click(getByText('Add'));

    expect(onSaveMock).toHaveBeenCalledWith('www.example.com');
  });

  it('clears the input field after adding', () => {
    const onSaveMock = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <DialogBox
        isOpen={true}
        onClose={() => {}}
        onSave={onSaveMock}
        title="Add Site"
        dashboard={true}
      />
    );

    const input = getByPlaceholderText(/enter website url/i);
    fireEvent.change(input, { target: { value: 'www.example.com' } });
    fireEvent.click(getByText('Add'));

    // Check if the text state is cleared after firing the add event
    expect(input.value).toBe('');
  });

  it('clears the input field and calls onClose when the close button is clicked', () => {
    const onCloseMock = jest.fn();
    const onSaveMock = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <DialogBox
        isOpen={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        title="Add Site"
        dashboard={true}
      />
    );

    const input = getByPlaceholderText(/enter website url/i);
    fireEvent.change(input, { target: { value: 'www.example.com' } });
    fireEvent.click(getByText('Close'));

    // The input field should be cleared when 'Close' is clicked
    expect(input.value).toBe('');
    // onClose function should be called
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('does not call onSave when the add button is clicked with empty input', () => {
    const onSaveMock = jest.fn();
    const { getByText } = render(
      <DialogBox
        isOpen={true}
        onClose={() => {}}
        onSave={onSaveMock}
        title="Add Site"
        dashboard={true}
      />
    );

    fireEvent.click(getByText('Add'));
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it('does not clear the input when the close button is clicked if input is already empty', () => {
    const onCloseMock = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <DialogBox
        isOpen={true}
        onClose={onCloseMock}
        onSave={() => {}}
        title="Add Site"
        dashboard={true}
      />
    );

    const input = getByPlaceholderText(/enter website url/i);
    expect(input.value).toBe(''); // Should already be empty

    fireEvent.click(getByText('Close'));
    expect(input.value).toBe(''); // Should remain empty
    expect(onCloseMock).toHaveBeenCalled();
  });
});
