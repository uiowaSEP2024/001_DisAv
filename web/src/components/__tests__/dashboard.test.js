import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

test('renders Dashboard with user information', () => {
  const user = { username: 'adnane', firstname: 'Adnane', lastname: 'Ezouhri' };
  sessionStorage.setItem('user', JSON.stringify(user));

  render(<Dashboard />);

  expect(screen.getByText('Welcome to Your Dashboard')).toBeInTheDocument();
  expect(screen.getByText(`Username: ${user.username}`)).toBeInTheDocument();
  expect(screen.getByText(`First name: ${user.firstname}`)).toBeInTheDocument();
  expect(screen.getByText(`Last name: ${user.lastname}`)).toBeInTheDocument();
});
