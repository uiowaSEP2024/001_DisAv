import React from 'react';
import { Image, StyleSheet, View, ScrollView } from 'react-native';
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
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Infinite Focus</Text>
        <View style={styles.btns}>
          <Button text={'Sign In'} onClick={() => navigation.navigate('Login')} />
          <Button text={'Create an account'} onClick={() => navigation.navigate('SignUp')} />
        </View>
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
  btns: {
    width: '100%', // Ensure buttons are full width
    alignItems: 'center', // Center buttons horizontally
  },
  gif: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.3, // 30% of screen height
    marginTop: 20,
  },
});
