import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignUp from './screens/SignUp';
import Login from './screens/Login';
import ForgotPassword from './screens/ForgotPassword';
import Home from './screens/Home';
import Rewards from './screens/Rewards';
import Settings from './screens/Settings';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Rewards" component={Rewards} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}