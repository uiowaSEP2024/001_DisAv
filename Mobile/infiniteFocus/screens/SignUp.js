import React from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';

export default function SignUp({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Title>Sign Up Screen</Title>
      <Button mode="contained" onPress={() => navigation.navigate('Login')}>
        Go to Login
      </Button>
    </View>
  );
}
