import { Image, StyleSheet, Text, View } from 'react-native';
import logo from '../assets/logo.png';
import * as React from 'react';
import LongBtn from '../components/LongBtn';
import { width, height } from '../config/DeviceDimensions';

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Infinite Focus</Text>
      <Image source={logo} style={styles.logo} />
      <View style={styles.btns}>
        <LongBtn text={'Sign In'} onClick={() => navigation.navigate('Login')} />
        <LongBtn text={'Create an account'} onClick={() => navigation.navigate('SignUp')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(14,36,183,0.71)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: height * 0.8,
    width: width * 0.5,
    marginTop: height * 0.2,
    marginBottom: height * 0.2,
  },
  title: {
    fontSize: 30,
    color: '#c6bce0',
    fontWeight: 'bold',
    marginBottom: -30,
  },
  btns: {
    marginTop: -20,
  },
});
