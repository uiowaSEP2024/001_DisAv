import React from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';

export default function Home({ navigation, route }) {
  const { user } = route.params;
  console.log('user', user);
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Title>Home Screen</Title>
      <Button mode="contained" onPress={() => navigation.navigate('Rewards')}>
        Go to Bens House
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Rewards')}>
        Go to Rewards
      </Button>
    </View>
  );
}
