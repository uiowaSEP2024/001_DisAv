import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Rewards from '../../screens/Rewards';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers(); // If you are using fake timers
});

describe('Rewards Screen', () => {
  it('renders correctly and can navigate to Settings', () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(<Rewards navigation={{ navigate: mockNavigate }} />);
    // Trigger the button press and assert that navigation was called with the correct argument.
    fireEvent.press(getByText('Go to Settings'));
    expect(mockNavigate).toHaveBeenCalledWith('Settings');
  });
});
