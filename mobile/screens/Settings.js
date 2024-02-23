import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native'; // Import Alert
import { Button, TextInput, Text } from 'react-native-paper';
import axios from 'axios';
import { api } from '../config/Api';
import { useSession } from '../context/SessionContext';
import CustomAlert from '../components/CustomAlert';

export default function Settings({ navigation }) {
  const { user, saveUser, logout } = useSession(); // Assuming deleteUser is a method to handle user state after deletion
  if (!user) {
    return null;
  }

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state for showing delete confirmation

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true); // Show custom alert for delete confirmation
  };

  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '' || '',
  });

  const handleInputChange = (name, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://${api}/user/update`, {
        user: { ...user, ...formData },
      });
      if (response.data) {
        await saveUser({ ...user, ...formData });
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      setErrorMessage('Error updating user information');
      setErrorVisible(true);
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await axios.delete(`http://${api}/user/delete-account`, {
        data: { userId: user.id },
      });
      if (response.status === 200) {
        // Handle user state after deletion, e.g., log out
        logout(); // Assuming deleteUser clears user data and handles logout
        navigation.navigate('Login'); // Assuming you have a login screen to navigate to
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setErrorMessage('Failed to delete account');
      setErrorVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TextInput
        label="Username"
        value={formData.username}
        onChangeText={value => handleInputChange('username', value)}
        style={styles.input}
        mode="outlined"
        testID="username-input"
      />
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={value => handleInputChange('email', value)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Password (leave blank to keep current)"
        value={formData.password}
        onChangeText={value => handleInputChange('password', value)}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Update Information
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Preferences')}
        style={styles.button}
      >
        Update Preferences
      </Button>
      {/* Delete Account Button */}
      <Button
        mode="contained"
        onPress={handleDeleteAccount}
        style={[styles.button, { backgroundColor: 'red' }]}
      >
        Delete Account
      </Button>
      <CustomAlert
        visible={showDeleteConfirm}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        buttons={[
          { text: 'Cancel', onPress: () => setShowDeleteConfirm(false) },
          { text: 'Delete', onPress: deleteAccount },
        ]}
        onClose={() => setShowDeleteConfirm(false)}
      />
      <CustomAlert
        visible={errorVisible}
        onClose={() => setErrorVisible(false)}
        message={errorMessage}
        buttons={[{ text: 'OK', onPress: () => setErrorVisible(false) }]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
    paddingVertical: 8,
  },
});
