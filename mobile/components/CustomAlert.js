import React from 'react';
import { Modal, Text, Button, Portal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { width, height } from '../config/DeviceDimensions';

const CustomAlert = ({ visible, message, onClose }) => {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
        <Text style={styles.message}>Alert: {message}</Text>
        <Button mode="contained" onPress={onClose} style={styles.button}>
          Close
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    // Use a fixed margin or percentage to center the modal
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: height / 4, // Adjust as needed to center the modal vertically
    width: width * 0.8, // Adjust the width as needed
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4, // Add elevation for shadow on Android (optional)
    shadowColor: '#000', // Shadow for iOS (optional)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
    color: 'red',
  },
  button: {
    // Adjust button size as needed
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default CustomAlert;
