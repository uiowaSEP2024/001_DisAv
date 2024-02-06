import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar.js';


test('renders navbar', () => {
  render(
    <Router>
      <Navbar />
    </Router>
  );

  // Check if logo is rendered
  const logoElement = screen.getByText('Logo');
  expect(logoElement).toBeInTheDocument();

  // Check if Log In button is rendered
  const loginButtonElement = screen.getByText('Log In');
  expect(loginButtonElement).toBeInTheDocument();

  // Check if Sign Up button is rendered
  const signupButtonElement = screen.getByText('Sign Up');
  expect(signupButtonElement).toBeInTheDocument();

  // Check if navbar class is present
  const navbarElement = screen.getByRole('navigation');
  expect(navbarElement).toHaveClass('navbar');
});
