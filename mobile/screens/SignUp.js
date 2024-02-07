import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';

export default function SignUpScreen({ navigation }) {
  const theme = useTheme();
  const styles = {
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    textInput: {
      marginTop: 8,
      backgroundColor: theme.colors.surface,
    },
    button: {
      marginTop: 16,
    },
    loginLink: {
      marginTop: 16,
      textAlign: 'center',
      color: theme.colors.primary,
    },
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    // Implement your sign-up logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        mode="outlined"
        style={styles.textInput}
      />
      <TextInput
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        mode="outlined"
        style={styles.textInput}
      />
      <TextInput
        label="Email"
        testID="email-input"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.textInput}
      />
      <TextInput
        label="Phone Number (Optional)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        mode="outlined"
        style={styles.textInput}
      />
      <TextInput
        label="Password"
        value={password}
        testID="password-input"
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.textInput}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        style={styles.textInput}
      />
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 16 }}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
