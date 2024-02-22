import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TouchableRipple } from 'react-native-paper';
import axios from 'axios';
import { api } from '../config/Api';
import { useSession } from '../context/SessionContext';

export default function Preferences({ navigation }) {
  const { user, saveUser } = useSession();
  const [preferredTasks, setPreferredTasks] = useState({
    work: user.preferredTasks?.work || false,
    read: user.preferredTasks?.read || false,
    exercise: user.preferredTasks?.exercise || false,
    rest: user.preferredTasks?.rest || false,
  });

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
      console.error('Error updating preferred tasks:', error);
    }
    navigation.goBack(); // Go back to Home screen after setting preferences
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>What kind of tasks do you want to do?</Text>
      {['work', 'read', 'exercise', 'rest'].map(task => (
        <TouchableRipple
          key={task}
          onPress={() => handleSelectTask(task)}
          style={[
            styles.taskButton,
            preferredTasks[task] ? { backgroundColor: 'green', color: 'white' } : {},
          ]}
          rippleColor="rgba(255, 255, 255, .32)"
        >
          <Text style={styles.taskText}>{task}</Text>
        </TouchableRipple>
      ))}
      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
        Submit
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  taskButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
    width: '100%',
  },
  taskText: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    width: '100%',
  },
});
