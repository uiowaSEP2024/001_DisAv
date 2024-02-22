import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Checkbox, Button, Text } from 'react-native-paper';
import CustomAlert from '../components/CustomAlert';
import { useSession } from '../context/SessionContext';
import { LinearGradient } from 'expo-linear-gradient';
import { width } from '../config/DeviceDimensions';
import axios from 'axios';
import { api } from '../config/Api';

export default function Preferences({ navigation }) {
  const { user, saveUser } = useSession();

  const [preferredTasks, setPreferredTasks] = useState(
    user.preferredTasks || {
      exercise: false,
      reading: false,
      meditation: false,
      socializing: false,
    }
  );

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectTask = task => {
    setPreferredTasks(prevTasks => ({
      ...prevTasks,
      [task]: !prevTasks[task],
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://${api}/user/update`, {
        user: { ...user, preferredTasks },
      });
      console.log('response', response);
      if (response.data) {
        await saveUser({ ...user, preferredTasks }); // Update user state with new preferredTasks
      }
    } catch (error) {
      setErrorMessage(error.message);
      setErrorVisible(true);
      return;
    }
    navigation.goBack(); // Go back to Home screen after setting preferences
  };

  return (
    <LinearGradient
      colors={['#00008B', '#ADD8E6', '#008000']} // Dark blue, light blue, green
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>What are your preferred tasks?</Text>
        {Object.keys(preferredTasks).map(task => (
          <Checkbox.Item
            key={task}
            style={styles.checkBoxItem}
            label={task.charAt(0).toUpperCase() + task.slice(1)}
            status={preferredTasks[task] ? 'checked' : 'unchecked'}
            onPress={() => handleSelectTask(task)}
            testID={task + '-checkbox'}
          />
        ))}
        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
          Submit
        </Button>
      </ScrollView>
      <CustomAlert
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  submitButton: {
    marginTop: 20,
  },
  gradient: {
    flex: 1,
  },
  checkBoxItem: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    width: width * 0.2,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
});
