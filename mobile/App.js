import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import AppNavigator from './navigation/AppNavigator';
import { SessionProvider } from './context/SessionContext';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black', // Primary color for your app
    secondary: 'gold', // Secondary color for your app
    background: 'white', // Background color for your app
    text: 'black', // Primary text color
    accent: 'gold', // Secondary color
    surface: 'white', // Card background color
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SessionProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SessionProvider>
    </PaperProvider>
  );
}
