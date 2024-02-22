import React from 'react';
import { Modal, Text, Button, Portal, Provider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { height } from '../config/DeviceDimensions';

const CustomAlert = ({ visible, message, onClose }) => {
  return (
    <Provider>
      <Portal>
        <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
          <Text style={styles.message}>Alert: {message}</Text>
          <Button mode="contained" onPress={onClose} style={styles.button}>
            Close
          </Button>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
    color: 'red',
  },
  button: {
    alignSelf: 'stretch',
    height: height * 0.1,
  },
});

export default CustomAlert;
