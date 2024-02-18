import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import Preference from '../Preference';

jest.mock('axios');

test('allows the user to toggle preferences', async () => {
    // Mock the user data in sessionStorage
    const mockUser = {
        username: 'testuser',
        preferredTasks: {
            Work: false,
            Reading: false,
            Exercise: false,
            Break: false
        }
    };
    sessionStorage.setItem('user', JSON.stringify(mockUser));

    // Mock the axios.put call
    axios.put.mockResolvedValue({ data: { message: 'User updated with preferred tasks' } });

    render(<Preference />);

    const workCheckbox = screen.getByLabelText(/Work/i);
    fireEvent.click(workCheckbox);
    expect(workCheckbox).toBeChecked();

    const readingCheckbox = screen.getByLabelText(/Reading/i);
    fireEvent.click(readingCheckbox);
    expect(readingCheckbox).toBeChecked();

    // Check that axios.put was called with the correct arguments
    expect(axios.put).toHaveBeenCalledWith('http://localhost:3002/user/update-preferred-tasks', {
        username: mockUser.username,
        preferredTasks: {
            Work: true,
            Reading: true,
            Exercise: false,
            Break: false
        }
    });
});
