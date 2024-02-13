import React from 'react';
import { Image, StyleSheet, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';

import logo from '../assets/logo.png'; // Adjust the path as necessary
import { LinearGradient } from 'expo-linear-gradient';
import { width, height } from '../config/DeviceDimensions';

export default function Welcome({ navigation }) {
  return (
    <LinearGradient
      colors={['#00008B', '#ADD8E6', '#008000']} // Dark blue, light blue, green
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container} testID="Welcome">
        <Image testID="logo" source={logo} style={styles.logo} />
        <Text style={styles.title}>Infinite Focus</Text>
        <Button
          style={styles.button}
          testID="login"
          mode="contained"
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Button>
        <Button
          style={styles.button}
          testID="signup"
          mode="contained"
          onPress={() => navigation.navigate('SignUp')}
        >
          Sign Up
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
    width: width * 0.3, // Adjusted to match Login.js
    height: height * 0.15, // Adjusted to match Login.js
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 24, // Adjusted to match Login.js
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: '100%',
    paddingVertical: 8,
    backgroundColor: '#6200ee', // Or any color that suits your theme
    color: 'white',
  },
  gif: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.3, // 30% of screen height
    marginTop: 20,
  },
});
