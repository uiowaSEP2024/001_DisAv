import React from 'react';
import { Button, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { height, width } from '../config/DeviceDimensions';
function LongBtn({ text, onClick }) {
  return (
    <Button onPress={onClick} style={styles.btn}>
      <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold' }}>{text}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: height * 0.05,
    height: height * 0.14,
    width: width * 0.45,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#061d4d',
  },
});

export default LongBtn;
