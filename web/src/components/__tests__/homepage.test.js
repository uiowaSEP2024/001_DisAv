import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Homepage from '../Homepage.js';

test('renders homepage', () => {
  render(
    <Router>
      <Homepage />
    </Router>
  );

  // Check if Navbar is rendered
  const navbarElement = screen.getByRole('navigation');
  expect(navbarElement).toBeInTheDocument();

  // Check if homepage class is present
  const homepageElement = screen.getByTestId('homepage');
  expect(homepageElement).toBeInTheDocument();
});
