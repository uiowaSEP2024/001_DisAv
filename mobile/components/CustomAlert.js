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
          <Button
            key={index}
            mode="contained"
            onPress={button.onPress}
            style={[styles.button, { backgroundColor: 'black' }]} // Ensure background color is black
            labelStyle={{ color: 'white' }} // Ensure text color is white
          >
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black', // Ensuring title text is black for contrast
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
    color: 'black', // Ensuring message text is black for readability
  },
  button: {
    marginTop: 10,
    width: '80%', // Ensure buttons are not too wide
    backgroundColor: 'black', // Button background to black for contrast
    color: 'white', // Button text color to white for readability
  },
});

export default CustomAlert;
