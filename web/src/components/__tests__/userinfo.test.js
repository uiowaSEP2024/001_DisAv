import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UserInfo from '../UserInfo'; // Adjust the import path as necessary
import axios from 'axios';

jest.mock('axios');

const initialUser = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('UserInfo Component', () => {
  beforeEach(() => {
    axios.put.mockClear();
  });

  it('renders correctly with initial user and buttons disabled', () => {
    const { getByPlaceholderText, getByText } = render(<UserInfo user={initialUser} />);
    expect(getByPlaceholderText('First Name')).toHaveValue('John');
    expect(getByPlaceholderText('First Name')).toBeDisabled();
    expect(getByText('Edit Profile')).toBeInTheDocument();
  });

  it('allows entering edit mode', () => {
    const { getByText, getByPlaceholderText } = render(<UserInfo user={initialUser} />);
    fireEvent.click(getByText('Edit Profile'));
    expect(getByPlaceholderText('First Name')).not.toBeDisabled();
    expect(getByText('Save Changes')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const { getByPlaceholderText } = render(<UserInfo user={initialUser} />);
    const firstnameInput = getByPlaceholderText('First Name');
    fireEvent.change(firstnameInput, { target: { value: 'Jane' } });
    expect(firstnameInput.value).toBe('Jane');
  });

  it('resets to initial values on cancel after changes', () => {
    const { getByText, getByPlaceholderText } = render(<UserInfo user={initialUser} />);
    fireEvent.click(getByText('Edit Profile'));
    const firstnameInput = getByPlaceholderText('First Name');
    fireEvent.change(firstnameInput, { target: { value: 'Jane' } });
    fireEvent.click(getByText('Cancel'));
    expect(firstnameInput).toHaveValue('John');
    expect(firstnameInput).toBeDisabled();
  });

  it('shows error when passwords do not match and prevents submission', () => {
    window.alert = jest.fn();

    const { getByPlaceholderText, getByText } = render(<UserInfo user={initialUser} />);
    fireEvent.click(getByText('Edit Profile'));
    fireEvent.change(getByPlaceholderText('Confirm New Password'), {
      target: { value: 'differentPassword' },
    });
    fireEvent.click(getByText('Save Changes'));

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
    expect(axios.put).not.toHaveBeenCalled();
  });

  it('submits data when form is correctly filled and passwords match', async () => {
    axios.put.mockResolvedValue({ data: { message: 'Profile updated' } });

    const { getByPlaceholderText, getByText } = render(<UserInfo user={initialUser} />);
    fireEvent.click(getByText('Edit Profile'));
    fireEvent.click(getByText('Save Changes'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:3002/user/update', {
        user: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
      });
      expect(getByText('Edit Profile')).toBeInTheDocument();
    });
  });

  it('handles error during profile update', async () => {
    axios.put.mockRejectedValue(new Error('Failed to update profile'));
    console.error = jest.fn(); // Optionally suppress error logging in test output

    const { getByText } = render(<UserInfo user={initialUser} />);
    fireEvent.click(getByText('Edit Profile'));
    fireEvent.click(getByText('Save Changes'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error updating profile', expect.any(Error));
    });
  });

  it('initial and edited values in input fields', () => {
    const { getByPlaceholderText, getByText } = render(<UserInfo user={initialUser} />);

    // Check initial disabled state and values
    expect(getByPlaceholderText('First Name')).toHaveValue('John');
    expect(getByPlaceholderText('First Name')).toBeDisabled();
    expect(getByPlaceholderText('Last Name')).toHaveValue('Doe');
    expect(getByPlaceholderText('Last Name')).toBeDisabled();
    expect(getByPlaceholderText('New Password')).toHaveValue('password123');
    expect(getByPlaceholderText('New Password')).toBeDisabled();
    expect(getByPlaceholderText('Enter email address')).toHaveValue('john.doe@example.com');
    expect(getByPlaceholderText('Enter email address')).toBeDisabled();

    // Enable editing
    fireEvent.click(getByText('Edit Profile'));

    // Check editable state and modify values
    const firstnameInput = getByPlaceholderText('First Name');
    const lastnameInput = getByPlaceholderText('Last Name');
    const passwordInput = getByPlaceholderText('New Password');
    const emailInput = getByPlaceholderText('Enter email address');

    fireEvent.change(firstnameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastnameInput, { target: { value: 'Smith' } });
    fireEvent.change(passwordInput, { target: { value: 'newPassword456' } });
    fireEvent.change(emailInput, { target: { value: 'jane.smith@example.com' } });

    expect(firstnameInput).toHaveValue('Jane');
    expect(firstnameInput).not.toBeDisabled();
    expect(lastnameInput).toHaveValue('Smith');
    expect(lastnameInput).not.toBeDisabled();
    expect(passwordInput).toHaveValue('newPassword456');
    expect(passwordInput).not.toBeDisabled();
    expect(emailInput).toHaveValue('jane.smith@example.com');
    expect(emailInput).not.toBeDisabled();

    // Cancel editing and check reset values
    fireEvent.click(getByText('Cancel'));

    expect(firstnameInput).toHaveValue('John');
    expect(firstnameInput).toBeDisabled();
    expect(lastnameInput).toHaveValue('Doe');
    expect(lastnameInput).toBeDisabled();
    expect(passwordInput).toHaveValue('password123');
    expect(passwordInput).toBeDisabled();
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(emailInput).toBeDisabled();
  });

  it('handles input changes and saves new data', async () => {
    axios.put.mockResolvedValue({ data: { message: 'Profile updated' } });

    const { getByText, getByPlaceholderText } = render(<UserInfo user={initialUser} />);
    fireEvent.click(getByText('Edit Profile'));

    const emailInput = getByPlaceholderText('Enter email address');
    fireEvent.change(emailInput, { target: { value: 'updated.email@example.com' } });

    fireEvent.click(getByText('Save Changes'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3002/user/update',
        expect.objectContaining({
          user: expect.objectContaining({
            email: 'updated.email@example.com',
          }),
        })
      );
    });
  });

  it('handles error during profile update', async () => {
    axios.put.mockRejectedValue(new Error('Failed to update profile'));
    console.error = jest.fn(); // Optionally suppress error logging in test output

    const { getByText } = render(<UserInfo user={initialUser} />);
    fireEvent.click(getByText('Edit Profile'));
    fireEvent.click(getByText('Save Changes'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error updating profile', expect.any(Error));
    });
  });
});
