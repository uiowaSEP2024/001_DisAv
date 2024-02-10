import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Welcome from '../../screens/Welcome';

// Mock the navigation prop
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

describe('Welcome Screen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<Welcome navigation={mockNavigation} />);

    // Check if the title is rendered
    expect(getByText('Infinite Focus')).toBeTruthy();
    // expect the logo image to be rendered
    expect(getByTestId('logo')).toBeTruthy();
  });

  it('navigates to Login screen when Sign In is pressed', () => {
    const { getByTestId } = render(<Welcome navigation={mockNavigation} />);

    const signInButton = getByTestId('login');
    fireEvent.press(signInButton);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to SignUp screen when Create an account is pressed', () => {
    const { getByTestId } = render(<Welcome navigation={mockNavigation} />);

    const signUpButton = getByTestId('signup');
    fireEvent.press(signUpButton);

    expect(mockNavigate).toHaveBeenCalledWith('SignUp');
  });
});
