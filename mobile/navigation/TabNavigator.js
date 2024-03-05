import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeStack from './HomeStack';
import Rewards from '../screens/Rewards';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="HomeStack" // Update this to HomeStack
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let testID;

        switch (route.name) {
          case 'HomeStack': // Update this case to HomeStack
            iconName = 'home';
            testID = 'homeIcon';
            break;
          case 'Rewards':
            iconName = 'auto-awesome';
            testID = 'card-giftcardIcon';
            break;
          case 'Settings':
            iconName = focused ? 'settings' : 'settings-applications';
            testID = 'settingsIcon';
            break;
          default:
            iconName = 'error';
            testID = 'defaultIcon';
        }

        return <MaterialIcons name={iconName} size={size} color={color} testID={testID} />;
      },
    })}
  >
    <Tab.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
    <Tab.Screen name="Rewards" component={Rewards} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

export default TabNavigator;
