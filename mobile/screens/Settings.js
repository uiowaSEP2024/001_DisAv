import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import axios from 'axios';
import { api } from '../config/Api';
import { useSession } from '../context/SessionContext';

export default function Settings({ navigation }) {
  const { user, saveUser } = useSession();
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '', // Password is not prefilled for security reasons
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
      console.log('response', response);
      if (response.data) {
        await saveUser({ ...user, ...formData });
        // alert('User information updated successfully.');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      // alert('An error occurred while updating user information.');
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
