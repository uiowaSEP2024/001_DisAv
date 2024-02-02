import { render, screen } from '@testing-library/react';
import Homepage from '../Homepage.js';

test('renders homepage', () => {
  render(<Homepage />);

  // Check if Navbar is rendered
  const navbarElement = screen.getByRole('navigation');
  expect(navbarElement).toBeInTheDocument();

  // Check if homepage class is present
  const homepageElement = screen.getByTestId('homepage');
  expect(homepageElement).toBeInTheDocument();
});
