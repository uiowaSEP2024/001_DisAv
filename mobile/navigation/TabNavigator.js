import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeStack from './HomeStack';
import Rewards from '../screens/Rewards';
import BreakScreen from '../screens/BreakScreen';
import ExerciseScreen from '../screens/ExerciseScreen'; // Import the ExerciseScreen

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="HomeStack"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let testID;

        switch (route.name) {
          case 'HomeStack':
            iconName = 'home';
            testID = 'homeIcon';
            break;
          case 'Rewards':
            iconName = 'auto-awesome';
            testID = 'card-giftcardIcon';
            break;
          case 'Break':
            iconName = focused ? 'free-breakfast' : 'free-breakfast';
            testID = 'free-breakfastIcon';
            break;
          case 'Exercise': // Add a case for the Exercise screen
            iconName = 'directions-walk';
            testID = 'exerciseIcon';
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
    <Tab.Screen name="Break" component={BreakScreen} />
    <Tab.Screen name="Exercise" component={ExerciseScreen} options={{ tabBarLabel: 'Exercise' }} />
  </Tab.Navigator>
);

export default TabNavigator;
