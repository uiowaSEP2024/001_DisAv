import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';

export default function Login({ navigation }) {
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
    signUpLink: {
      marginTop: 16,
      textAlign: 'center',
      color: theme.colors.primary,
    },
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your login logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Email"
        testID="email-input"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.textInput}
      />
      <TextInput
        label="Password"
        testID="password-input"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.textInput}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 16 }}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
