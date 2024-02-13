import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { render } from '@testing-library/react-native';
import DrawerNavigator from '../../navigation/DrawerNavigator';
import TabNavigator from '../../navigation/TabNavigator';
import Settings from '../../screens/Settings';
import SignOut from '../../components/SignOut';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@react-navigation/drawer', () => {
  return {
    createDrawerNavigator: jest.fn().mockReturnValue({
      Navigator: ({ children }) => <div>{children}</div>,
      Screen: ({ children }) => <div>{children}</div>,
    }),
  };
});

jest.mock('../../navigation/TabNavigator', () => 'TabNavigator');
jest.mock('../../screens/Settings', () => 'SettingsScreen');
jest.mock('../../components/SignOut', () => 'SignOutComponent');

describe('DrawerNavigator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    createDrawerNavigator.mockImplementation(() => ({
      Navigator: ({ children }) => <div>{children}</div>,
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders the TabNavigator, Settings, and SignOut screens', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <DrawerNavigator>
          <TabNavigator />
          <Settings />
          <SignOut />
        </DrawerNavigator>
      </NavigationContainer>
    );

    expect(getByTestId('Home')).toBeTruthy();
    expect(getByTestId('Settings')).toBeTruthy();
    expect(getByTestId('SignOut')).toBeTruthy();
  });
});
