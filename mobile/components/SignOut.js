import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSession } from '../context/SessionContext';

const SignOut = () => {
  const navigation = useNavigation();
  const { logout } = useSession();

  useEffect(() => {
    async function logoutUser() {
      await logout();
      navigation.navigate('Auth');
    }
    logoutUser();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignOut;
