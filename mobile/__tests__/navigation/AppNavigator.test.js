import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../../navigation/AppNavigator';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    user: null, // or user: {id: '123', name: 'John Doe'} to simulate a logged-in user
  }),
}));

jest.mock('../../navigation/AuthNavigator', () => 'AuthNavigator');
jest.mock('../../navigation/DrawerNavigator', () => 'DrawerNavigator');

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders the AuthNavigator when no user is logged in', () => {
    const { getByText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    expect(getByText('AuthNavigator')).toBeTruthy();
  });

  it('renders the DrawerNavigator when a user is logged in', () => {
    jest.mock('../../context/SessionContext', () => ({
      useSession: () => ({
        user: { id: '123', name: 'John Doe' },
      }),
    }));

    const { getByText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    expect(getByText('DrawerNavigator')).toBeTruthy();
  });
});
