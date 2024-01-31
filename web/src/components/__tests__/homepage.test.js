import { render, screen } from '@testing-library/react';
import Homepage from '../Homepage.js';

test('renders homepage', () => {
  render(<Homepage />);
  const linkElement = screen.getByText(/sign up/i);
  expect(linkElement).toBeInTheDocument();
});
