import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import Home from '../screens/Home';
import Rewards from '../screens/Rewards';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home';
        } else if (route.name === 'Rewards') {
          iconName = focused ? 'card-giftcard' : 'auto-awesome';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-applications';
        }

        // You can return any component that you like here!
        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Rewards" component={Rewards} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

export default TabNavigator;
