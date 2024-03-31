import React from 'react';
import { render } from '@testing-library/react';
import BookCard from '../BookCard';

describe('<BookCard />', () => {
  test('renders correctly with given props', () => {
    const props = {
      title: 'Test Title',
      imageLink: 'test-link.jpg',
      completionPercentage: 50,
    };
    const { getByText, getByAltText } = render(<BookCard {...props} />);
    expect(getByText(props.title)).toBeInTheDocument();
    expect(getByAltText(props.title)).toHaveAttribute('src', props.imageLink);
  });
});
