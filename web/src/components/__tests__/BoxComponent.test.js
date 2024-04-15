import React from 'react';
import { render, screen } from '@testing-library/react';
import BoxComponent from '../BoxComponent';

describe('BoxComponent', () => {
  test('renders BoxComponent with content', () => {
    const content = ['example.com', 'test.com'];

    render(<BoxComponent content={content} />);

    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(screen.getByText('test.com')).toBeInTheDocument();
  });

  test('renders BoxComponent with no content', () => {
    const content = [];

    render(<BoxComponent content={content} />);

    expect(screen.getByText('No sites are currently being tracked.')).toBeInTheDocument();
  });
});
