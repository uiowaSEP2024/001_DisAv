import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import Home from '../screens/Home';
import Rewards from '../screens/Rewards';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarIcon: ({ route, focused, color, size }) => {
        let iconName;
        let testID;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home';
          testID = 'homeIcon'; // Set testID for Home
        } else if (route.name === 'Rewards') {
          iconName = focused ? 'card-giftcard' : 'auto-awesome';
          testID = 'card-giftcardIcon'; // Set testID for Rewards
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-applications';
          testID = 'settingsIcon'; // Set testID for Settings
        }

        // You can return any component that you like here!
        // Include the testID prop when returning the MaterialIcons component
        return <MaterialIcons name={iconName} size={size} color={color} testID={testID} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: [{ display: 'flex' }, null], // Moved from tabBarOptions
    }}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Rewards" component={Rewards} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

export default TabNavigator;
