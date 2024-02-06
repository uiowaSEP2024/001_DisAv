// const React = require('react');
// const { render, fireEvent, waitFor } = require('@testing-library/react');
// const axios = require('axios');
// const Login = require('../Login');

// jest.mock('axios');

// describe('Login', () => {
//   it('renders the login form', () => {
//     const { getByTestId } = render(<Login />);
//     const form = getByTestId('login-form');
//     expect(form).toBeInTheDocument();
//   });

//   it('calls axios post on form submission', async () => {
//     const { getByTestId, getByLabelText } = render(<Login />);
//     const form = getByTestId('login-form');

//     const usernameInput = getByLabelText('Username:');
//     const passwordInput = getByLabelText('Password:');

//     fireEvent.change(usernameInput, { target: { value: 'testuser' } });
//     fireEvent.change(passwordInput, { target: { value: 'testpass' } });

//     axios.post.mockResolvedValue({ data: {} });

//     fireEvent.submit(form);

//     await waitFor(() => expect(axios.post).toHaveBeenCalled());
//   });
// });
