import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { width, height } from '../config/DeviceDimensions';
import TextField from '../components/TextField';
import logo from '../assets/logo.png';
import axios from 'axios';
import { api } from '../config/Api';
import LongBtn from '../components/LongBtn';
export default function SignUp({ navigation }) {
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  async function signUp() {
    console.log('HELLO');
    if (
      firstname === '' ||
      lastname === '' ||
      username === '' ||
      password === '' ||
      rePassword === '' ||
      email === ''
    ) {
      setError('All fields are required');
    } else if (password !== rePassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      console.log(api);
      await axios
        .post('http://' + api + `/auth/register`, {
          firstname,
          lastname,
          username,
          email,
          password,
        })
        .then(r => {
          console.log('Response: ', r.data);
          navigation.navigate('Login');
        })
        .catch(err => {
          console.log('Error', err);
        });
    }
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Sign Up</Text>
        </View>
        <Text style={styles.err}>{error}</Text>
        <View style={styles.row2}>
          <TextField title={'First name'} half={true} onChange={setfirstname} />
          <TextField title={'Last name'} half={true} onChange={setlastname} />
        </View>
        <TextField title={'User name'} onChange={setUserName} />
        <TextField title={'Email'} onChange={setEmail} />
        <TextField title={'Password'} password={true} onChange={setPassword} />
        <TextField title={'Re-Enter Password'} password={true} onChange={setRePassword} />
        <LongBtn text={'Signh Up'} onClick={signUp} />

        <TouchableOpacity style={styles.signup} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupText}>Already have an account? Sign In!</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(14,36,183,0.71)',
    alignItems: 'center',
  },
  signupText: {
    color: '#ffff',
    fontStyle: 'italic',
    marginTop: height * 0.02,
  },
  signup: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: height * 0.05,
  },
  row2: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 40,
    color: '#c2bdbd',
    fontWeight: 'bold',
    marginTop: height * 0.1,
    alignSelf: 'center',
    marginLeft: width * 0.01,
  },
  btn: {
    marginTop: height * 0.05,
    height: height * 0.14,
    width: width * 0.45,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#061d4d',
  },
  label: {
    fontSize: 28,
    color: '#c2bdbd',
    fontWeight: 'bold',
    marginTop: -height * 0.1,
    marginLeft: width * 0.01,
  },

  logo: {
    height: height * 0.3,
    width: width * 0.17,
    marginTop: height * 0.1,
    alignSelf: 'center',
  },
  err: {
    color: 'rgba(239,12,12,0.88)',
    fontSize: 20,
    marginTop: -20,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});
