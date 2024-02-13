import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from '../../navigation/TabNavigator';

// Mock the useSession hook
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    user: { id: '123', name: 'John Doe' }, // Mocked user object
  }),
}));

// Mock the useRoute hook from @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useRoute: () => ({
      name: 'Home', // Mock the name of the route
    }),
  };
});

// Mock MaterialIcons to intercept the props, including testID
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('TabNavigator', () => {
  it('should render the TabNavigator with its initial route', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    );

    // Assertions to check if icons are rendered
    expect(getByTestId('homeIcon')).toBeTruthy();
    expect(getByTestId('card-giftcardIcon')).toBeTruthy();
    expect(getByTestId('settingsIcon')).toBeTruthy();
  });
});
