import React from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { useSession } from '../context/SessionContext';

export default function Home({ navigation }) {
  const { user } = useSession();
  console.log('user', user);
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }} testID="Home">
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
