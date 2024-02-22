import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Alert } from 'react-native';
import TabNavigator from './TabNavigator';
import Settings from '../screens/Settings';
import { useSession } from '../context/SessionContext'; // Ensure you have this hook to access logout functionality

const Drawer = createDrawerNavigator();

// Custom Drawer Content
function CustomDrawerContent(props) {
  const { logout } = useSession();

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await logout();
            props.navigation.navigate('Auth'); // Navigate to Auth or initial screen after logout
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Sign Out" onPress={confirmSignOut} />
    </DrawerContentScrollView>
  );
}

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Tabs" // Update this to Tabs
    drawerContent={props => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="Tabs" component={TabNavigator} />
    <Drawer.Screen name="Settings" component={Settings} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
