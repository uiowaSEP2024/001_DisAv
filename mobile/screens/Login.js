import React, { useState } from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import logo from '../assets/logo.png'; // Adjust the path as necessary
import { LinearGradient } from 'expo-linear-gradient';
import { width, height } from '../config/DeviceDimensions';
import axios from 'axios';
import { api } from '../config/Api';
import { useSession } from '../context/SessionContext';

export default function Login({ navigation }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useSession();

  async function signIn() {
    if (userName === '' || password === '') {
      setErr('All fields are required');
      return;
    }
    await axios
      .post(`http://${api}/auth/login`, {
        username: userName,
        password,
      })
      .then(r => {
        if (r.data.message) {
          setErr(r.data.message);
        } else {
          console.log(r.data);
          navigation.popToTop();
          login(r.data.user);
          navigation.navigate('Home');
        }
      })
      .catch(error => {
        console.log('Error', error);
        setErr('An error occurred during login.');
      });
  }

  return (
    <LinearGradient
      colors={['#00008B', '#ADD8E6', '#008000']} // Dark blue, light blue, green
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container} testID="Login">
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Sign In</Text>
        {err ? (
          <Text testID="errorText" style={styles.error}>
            {err}
          </Text>
        ) : null}
        <TextInput
          label="User Name"
          testID="userNameInput"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Password"
          testID="passwordInput"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <Button testID="loginButton" mode="contained" onPress={signIn} style={styles.button}>
          Login
        </Button>
        <Button
          onPress={() => navigation.navigate('SignUp')}
          style={styles.textButton}
          labelStyle={styles.textButtonLabel}
        >
          Dont have an account? Sign up!
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
    width: width * 0.3, // 30% of screen width
    height: height * 0.15, // 15% of screen height
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
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  button: {
    marginTop: 10,
    width: '100%',
    paddingVertical: 8,
    backgroundColor: '#6200ee',
  },
  textButton: {
    marginTop: 15,
    backgroundColor: 'transparent',
  },
  textButtonLabel: {
    color: '#6200ee',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
