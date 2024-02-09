// import React from 'react';
// import { render, fireEvent, waitFor, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import axios from 'axios';
// import Signup from '../Signup';

// jest.mock('axios');

// describe('Signup', () => {
//   it('renders the signup form', () => {
//     render(
//       <MemoryRouter>
//         <Signup />
//       </MemoryRouter>
//     );
//     const form = screen.getByTestId('signup-form');
//     expect(form).toBeInTheDocument();
//   });

//   it('calls axios post on form submission', async () => {
//     render(
//       <MemoryRouter>
//         <Signup />
//       </MemoryRouter>
//     );

//     const usernameInput = screen.getByPlaceholderText('Username');
//     const emailInput = screen.getByPlaceholderText('Email');
//     const passwordInput = screen.getByPlaceholderText('Password');
//     const firstnameInput = screen.getByPlaceholderText('First Name');
//     const lastnameInput = screen.getByPlaceholderText('Last Name');

//     fireEvent.change(usernameInput, { target: { value: 'testuser' } });
//     fireEvent.change(emailInput, { target: { value: 'testuser@test.com' } });
//     fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
//     fireEvent.change(firstnameInput, { target: { value: 'Test' } });
//     fireEvent.change(lastnameInput, { target: { value: 'User' } });

//     axios.post.mockResolvedValue({ data: {} });

//     fireEvent.submit(screen.getByTestId('signup-form'));

//     await waitFor(() => expect(axios.post).toHaveBeenCalled());
//   });
// });
