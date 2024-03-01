import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Preferences from '../screens/Preferences';
import Tasks from '../screens/Tasks';

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Preferences" component={Preferences} />
    <Stack.Screen name="Tasks" component={Tasks} />
  </Stack.Navigator>
);

export default HomeStack;
