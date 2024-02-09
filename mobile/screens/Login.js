import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png';
import { width, height } from '../config/DeviceDimensions';
import TextField from '../components/TextField';
import LongBtn from '../components/LongBtn';
import axios from 'axios';
import { useState } from 'react';
import { api } from '../config/Api';
// import{useCookies} from "react-cookie"

export default function Login({ navigation }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  // const [cookies,setCookie] = useCookies(["access-token","username"])
  async function signIn() {
    await axios
      .post('http://' + api + `/auth/login`, {
        username: userName,
        password,
      })
      .then(r => {
        const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

        if (hasOwnProperty(r.data, 'message')) {
          setErr(r.data.message);
        } else {
          // setCookie("access-token",r.data.token)
          // setCookie("username",r.data.username)
          console.log(r.data);
          // window.localStorage.setItem("userId",r.data.userId)
          navigation.popToTop();
          navigation.replace('Home', { user: r.data.user });
        }
      })
      .catch(err => {
        console.log('Error', err);
      });
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.err}>{err}</Text>
        <TextField testID="username" title={'User Name'} onChange={setUserName} />
        <TextField testID="password-input" title={'Password'} password={true} onChange={setPassword} />
        <View style={styles.btn}>
          <LongBtn text="Sign In" onClick={signIn} />
        </View>
        <TouchableOpacity style={styles.signup} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupText}>Dont have an account? Sign up!</Text>
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
  err: {
    color: 'rgba(245,237,237,0.81)',
    fontSize: 20,
    marginTop: -10,
    alignSelf: 'center',
  },
  signupText: {
    color: '#ffff',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 30,
    color: '#c6bce0',
    fontWeight: 'bold',
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
    alignSelf: 'center',
  },
  signup: {
    alignSelf: 'center',
  },
  btn: {
    alignSelf: 'center',
    marginTop: height * 0.1,
  },
  logo: {
    height: height * 0.55,
    width: width * 0.35,
    marginTop: height * 0.3,
    alignSelf: 'center',
  },
});
