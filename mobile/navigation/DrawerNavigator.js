import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import Settings from '../screens/Settings';
import SignOut from '../components/SignOut'; // Import the SignOut component

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Tabs" testID="DrawerNavigator">
    <Drawer.Screen name="Tabs" component={TabNavigator} options={{ unmountOnBlur: true }} />
    <Drawer.Screen name="Settings" component={Settings} options={{ unmountOnBlur: true }} />
    <Drawer.Screen name="SignOut" component={SignOut} options={{ unmountOnBlur: true }} />
    {/* Add the SignOut screen. unmountOnBlur ensures the component resets on navigation */}
  </Drawer.Navigator>
);

export default DrawerNavigator;
