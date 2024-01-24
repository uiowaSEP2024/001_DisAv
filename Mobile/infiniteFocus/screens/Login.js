import React from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';

export default function Login({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Title>Login Screen</Title>
      <Button mode="contained" onPress={() => navigation.navigate('SignUp')}>
        Go to Sign Up
      </Button>
    </View>
  );
}