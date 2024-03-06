import React, { useState } from 'react';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { Button, Text, useTheme, Dialog, Portal } from 'react-native-paper';
// import { LinearGradient } from 'expo-linear-gradient';
import { useSession } from '../context/SessionContext';
import logo from '../assets/logo.png'; // Ensure the path to your logo is correct

export default function Home({ navigation }) {
  const { user } = useSession();

  if (!user) {
    return null;
  }

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={{ color: colors.onSurface, margin: 10 }}>
        {user && `Hello, ${user.firstname}!`}
      </Text>
      <Button mode="contained" onPress={() => navigation.navigate('Tasks')} style={styles.button}>
        {' '}
        Tasks
      </Button>
      <Portal>
        {user &&
          user.preferredTasks &&
          Object.values(user.preferredTasks).every(value => value === false) &&
          welcome()}
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
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
