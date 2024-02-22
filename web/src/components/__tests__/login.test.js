import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../Login';
import { AuthProvider } from '../AuthContext';

jest.mock('axios');

describe('Login', () => {
  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );
    const form = screen.getByTestId('login-form');
    expect(form).toBeInTheDocument();
  });

  it('calls axios post on form submission', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');

    fireEvent.change(usernameInput, { target: { value: 'adnane' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });

    axios.post.mockResolvedValue({ data: {} });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
