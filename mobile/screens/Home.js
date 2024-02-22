import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useSession } from '../context/SessionContext';
import logo from '../assets/logo.png'; // Ensure the path to your logo is correct

export default function Home({ navigation }) {
  const { user } = useSession();
  const { colors } = useTheme();

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
        <Text style={styles.title}>Welcome Home</Text>
        <Text style={{ color: colors.onSurface, margin: 10 }}>
          {user && `Hello, ${user.firstname}!`}
        </Text>
        {user && user.preferredTasks.length === 0 && (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Preferences')}
            style={styles.button}
          >
            Go to Preferences
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Settings')}
          style={styles.button}
        >
          Settings
        </Button>
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
