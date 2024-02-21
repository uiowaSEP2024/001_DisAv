import React from 'react';
import { View, Button, Text } from 'react-native';
import { useSession } from '../context/SessionContext';

export default function Home({ navigation }) {
  const { user } = useSession();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }} testID="Home">
      <Text>Home Screen</Text>
      {user && user.preferredTasks.length === 0 && (
        <Button title="Go to Preferences" onPress={() => navigation.navigate('Preferences')} />
      )}
    </View>
  );
}
