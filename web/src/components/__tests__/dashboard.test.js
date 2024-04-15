import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

test('renders Dashboard with user information', () => {
  const user = {
    username: 'adnane',
    firstname: 'Adnane',
    lastname: 'Ezouhri',
    email: 'adnane@gmail.com',
  };
  sessionStorage.setItem('user', JSON.stringify(user));

  render(<Dashboard />);

  expect(screen.getByText('Hi, Adnane')).toBeInTheDocument();
  expect(
    screen.getByText(`These sites are currently being monitored for doom scrolling:`)
  ).toBeInTheDocument();
});
