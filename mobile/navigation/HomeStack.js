import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Preferences from '../screens/Preferences';

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Preferences" component={Preferences} />
  </Stack.Navigator>
);

export default HomeStack;
