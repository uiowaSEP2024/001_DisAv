import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { Button, Text, useTheme, Dialog, Portal } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useSession } from '../context/SessionContext';
import logo from '../assets/logo.png'; // Ensure the path to your logo is correct

export default function Home({ navigation }) {
  const { user } = useSession();

  console.log('user', user);
  const { colors } = useTheme();
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  function welcome() {
    return (
      <Dialog visible={welcomeVisible}>
        <Dialog.Title>Welcome</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Welcome to infinite focus, an app that will enable you to avoid doom scrolling and enjoy
            the more important things in life
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="outlined"
            onPress={() => {
              setWelcomeVisible(false);
              navigation.navigate('Preferences');
            }}
            style={styles.button}
          >
            Next
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  }

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user, navigation]);

  return (
    <LinearGradient
      colors={['#00008B', '#ADD8E6', '#008000']} // Dark blue, light blue, green
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={{ color: colors.onSurface, margin: 10 }}>
          {user && `Hello, ${user.firstname}!`}
        </Text>
        <Portal>
          {user && user.preferredTasks && user.preferredTasks.length === 0 && welcome()}
        </Portal>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200, // Adjust based on your logo's aspect ratio
    height: 100, // Adjust based on your logo's aspect ratio
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: '80%',
    paddingVertical: 8,
  },
});
