import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import AuthNavigator from '../../navigation/AuthNavigator';
import AppNavigator from '../../navigation/AppNavigator';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      dev: true,
    },
    hostUri: 'http://192.168.0.113:3002',
  },
}));

jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    login: jest.fn().mockImplementation(() => Promise.resolve(true)),
  }),
}));

jest.mock('react-native/Libraries/Animated/src/Animated', () => 'Animated');

jest.mock('../../screens/Login', () => 'LoginScreen');
jest.mock('../../screens/SignUp', () => 'SignUpScreen');
jest.mock('../../screens/Welcome', () => 'WelcomeScreen');

describe('AuthNavigator', () => {
  it('renders the Welcome screen as the initial route', () => {
    const { debug } = render(
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );

    debug(); // Use this to see what's being rendered
  });

  it('navigates to the Login screen', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <AppNavigator>
          <AuthNavigator />
        </AppNavigator>
      </NavigationContainer>
    );

    expect(getByTestId('Login')).toBeTruthy();
  });

  it('navigates to the SignUp screen', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <AppNavigator>
          <AuthNavigator />
        </AppNavigator>
      </NavigationContainer>
    );

    expect(getByTestId('SignUp')).toBeTruthy();
  });
});
