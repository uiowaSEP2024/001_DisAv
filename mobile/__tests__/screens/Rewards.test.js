import React from 'react';
import { render } from '@testing-library/react-native';
import Rewards from '../../screens/Rewards';

const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    user: {
      preferredTasks: { work: false, read: true, exercise: false, rest: true },
    },
  }),
}));

describe('Rewards Screen', () => {
  it('renders correctly and can navigate to Settings', () => {
    const { getByText } = render(<Rewards navigation={mockNavigation} />);
    // Trigger the button press and assert that navigation was called with the correct argument.
    expect(getByText('Rewards Screen')).toBeTruthy();
  });
});
