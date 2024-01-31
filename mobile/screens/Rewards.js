import React from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';

export default function Rewards({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Title>Rewards Screen</Title>
      <Button mode="contained" onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}
