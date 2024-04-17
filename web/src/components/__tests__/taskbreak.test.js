import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskBreak from '../TaskBreak';

describe('TaskBreak', () => {
  it('renders correctly', () => {
    render(<TaskBreak />);

    expect(screen.getByText('Break Time')).toBeInTheDocument();
    expect(
      screen.getByText('Read a book, exercise or wait out timer to continue browsing')
    ).toBeInTheDocument();
  });
});
