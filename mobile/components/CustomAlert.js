import React from 'react';
import { Modal, Text, Button, Portal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { width, height } from '../config/DeviceDimensions';

const CustomAlert = ({ visible, title, message, buttons = [], onClose }) => {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>
        {buttons.map((button, index) => (
          <Button key={index} mode="contained" onPress={button.onPress} style={styles.button}>
            {button.text}
          </Button>
        ))}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: height / 4,
    width: width * 0.4, // Adjusted for potential wider content
    minHeight: height / 4,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
    color: 'black', // Changed to black for general use, adjust as needed
  },
  button: {
    marginTop: 10,
    width: '80%', // Ensure buttons are not too wide
  },
});

export default CustomAlert;
