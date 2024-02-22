import React from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { useSession } from '../context/SessionContext';

export default function Rewards({ navigation }) {
  const { user } = useSession();
  console.log('user', user);
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }} testID="Rewards">
      <Title>Rewards Screen</Title>
      <Button mode="contained" onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}
