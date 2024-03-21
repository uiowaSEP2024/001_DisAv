import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar Component', () => {
  test('renders Navbar with buttons for non-logged in user', () => {
    render(
      <MemoryRouter>
        <Navbar isLoggedIn={false} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('renders Navbar with user options for logged-in user', () => {
    render(
      <MemoryRouter>
        <Navbar isLoggedIn={true} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Rewards/i)).toBeInTheDocument();
    expect(screen.getByText(/Preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
  });

  test('invokes logout handler when log out is clicked', () => {
    const handleLogout = jest.fn();
    render(
      <MemoryRouter>
        <Navbar isLoggedIn={true} onLogout={handleLogout} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Log Out/i));
    expect(handleLogout).toHaveBeenCalled();
  });
});
