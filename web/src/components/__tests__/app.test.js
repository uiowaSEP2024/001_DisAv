import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from '../../App';
import { AuthContext } from '../AuthContext';

test('renders App component with Navbar', () => {
  const mockAuthContextValue = {
    isLoggedIn: true,
    logout: jest.fn(),
  };

  render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContext.Provider>
  );

  const navbarElement = screen.getByTestId('navbar'); // Ensure the case matches the actual text
  expect(navbarElement).toBeInTheDocument();
});

test('logs out user when logout button is clicked', () => {
  const mockAuthContextValue = {
    isLoggedIn: true,
    logout: jest.fn(),
  };

  render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <BrowserRouter>
        {' '}
        {/* Wrap the App component with BrowserRouter */}
        <App />
      </BrowserRouter>
    </AuthContext.Provider>
  );

  const logoutButton = screen.getByText('Log Out');
  fireEvent.click(logoutButton);

  expect(mockAuthContextValue.logout).toHaveBeenCalled();
});
