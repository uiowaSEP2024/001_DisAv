import React from 'react';
import { View } from 'react-native';
import { Title } from 'react-native-paper';
import { useSession } from '../context/SessionContext';

export default function Rewards({ navigation }) {
  const { user } = useSession();
  if (!user) {
    return null;
  }
  console.log('user', user);
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Title>Rewards Screen</Title>
    </View>
  );
}
