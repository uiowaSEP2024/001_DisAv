import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Preference from '../Preference';

jest.mock('axios');

test('allows the user to toggle preferences', async () => {
  const mockUser = {
    username: 'testuser',
    preferredTasks: {
      "Work": false,
      "Reading": false,
      "Exercise": false,
      "Break": false
    },
  };
  sessionStorage.setItem('user', JSON.stringify(mockUser));

  axios.put.mockResolvedValue({ data: { message: 'User updated with preferred tasks' } });

  render(<Preference />);

  const workCheckbox = screen.getByLabelText(/Work/i);
  fireEvent.click(workCheckbox);

  const readingCheckbox = screen.getByLabelText(/Reading/i);
  fireEvent.click(readingCheckbox);

  // Add a small delay to ensure axios.put has been called
  // await new Promise(resolve => setTimeout(resolve, 1000));
  const submitButton = screen.getByText('Submit');
  fireEvent.click(submitButton);

  await waitFor(() =>expect(axios.put).toHaveBeenCalledWith('http://localhost:3002/user/update-preferred-tasks', {
    username: mockUser.username,
    preferredTasks: {
      Work: true,
      Reading: true,
      Exercise: false,
      Break: false,
    },
  }));
});

// test('updates preferences on submit', async () => {
//   const mockUser = {
//     username: 'testuser',
//     preferredTasks: {
//       Work: false,
//       Reading: false,
//       Exercise: false,
//       Break: false,
//     },
//   };
//   sessionStorage.setItem('user', JSON.stringify(mockUser));

//   axios.put.mockResolvedValue({ data: { message: 'User updated with preferred tasks' } });

//   render(<Preference />);

//   const workCheckbox = screen.getByLabelText(/Work/i);
//   fireEvent.click(workCheckbox);

//   const readingCheckbox = screen.getByLabelText(/Reading/i);
//   fireEvent.click(readingCheckbox);

//   const submitButton = screen.getByText('Submit');
//   fireEvent.click(submitButton);

//   await waitFor(() => {
//     expect(axios.put).toHaveBeenCalledWith('http://localhost:3002/user/update-preferred-tasks', {
//       username: mockUser.username,
//       preferredTasks: {
//         Work: true,
//         Reading: true,
//         Exercise: false,
//         Break: false,
//       },
//     });
//   });
// });

// test('fetches preferredTasks from the database for new user', async () => {
//   const mockUser = {
//     username: 'newuser',
//     preferredTasks: null,
//   };
//   sessionStorage.setItem('user', JSON.stringify(mockUser));

//   const mockResponse = {
//     data: {
//       preferredTasks: {
//         Work: true,
//         Reading: false,
//         Exercise: true,
//         Break: false,
//       },
//     },
//   };

//   axios.get.mockResolvedValue(mockResponse);

//   render(<Preference />);

//   await waitFor(() => {
//     expect(axios.get).toHaveBeenCalledWith('http://localhost:3002/user/preferred-tasks/newuser');
//   });

//   await waitFor(() => {
//     expect(screen.getByLabelText(/Work/i).checked).toBe(true);
//   });

//   await waitFor(() => {
//     expect(screen.getByLabelText(/Reading/i).checked).toBe(false);
//   });

//   await waitFor(() => {
//     expect(screen.getByLabelText(/Exercise/i).checked).toBe(true);
//   });

//   await waitFor(() => {
//     expect(screen.getByLabelText(/Break/i).checked).toBe(false);
//   });
// });

test('loads default preferences for new user with no stored preferences', async () => {
  const mockUser = {
    username: 'newuser',
    preferredTasks: null,
  };
  sessionStorage.setItem('user', JSON.stringify(mockUser));

  render(<Preference />);

  await waitFor(() => {
    expect(screen.getByLabelText(/Work/i).checked).toBe(false);
    expect(screen.getByLabelText(/Reading/i).checked).toBe(false);
    expect(screen.getByLabelText(/Exercise/i).checked).toBe(false);
    expect(screen.getByLabelText(/Break/i).checked).toBe(false);
  });
});

// test('loads user preferences when available', async () => {
//   const mockUser = {
//     username: 'existinguser',
//     preferredTasks: {
//       Work: true,
//       Reading: false,
//       Exercise: true,
//       Break: false,
//     },
//   };
//   sessionStorage.setItem('user', JSON.stringify(mockUser));

//   render(<Preference />);

//   await waitFor(() => {
//     expect(screen.getByLabelText(/Work/i).checked).toBe(true);
//     expect(screen.getByLabelText(/Reading/i).checked).toBe(false);
//     expect(screen.getByLabelText(/Exercise/i).checked).toBe(true);
//     expect(screen.getByLabelText(/Break/i).checked).toBe(false);
//   });
// });
