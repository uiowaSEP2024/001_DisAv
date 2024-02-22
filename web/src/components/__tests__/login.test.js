import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import App from '../../App';
import { AuthContext } from '../AuthContext';

test('renders App component with Navbar', () => {
  const mockAuthContextValue = {
    isLoggedIn: true,
    logout: jest.fn(),
  };

  render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <MemoryRouter> {/* Wrap the App component with MemoryRouter */}
        <App />
      </MemoryRouter>
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
      <MemoryRouter> {/* Wrap the App component with MemoryRouter */}
        <App />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const logoutButton = screen.getByText('Log Out');
  fireEvent.click(logoutButton);

  expect(mockAuthContextValue.logout).toHaveBeenCalled();
});
