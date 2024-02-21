import React, { useState } from 'react';
import { View, Button, Text, TouchableOpacity } from 'react-native';
import { api } from '../config/Api';
import axios from 'axios';
import { useSession } from '../context/SessionContext';

export default function Preferences({ navigation }) {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const { user, setUser } = useSession();

  const handleSelectTask = task => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter(t => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://${api}/user/update`, {
        user: { ...user, selectedTasks },
      });
      if (response.data) {
        setUser({ ...user, selectedTasks }); // Update user state with new preferredTasks
      }
    } catch (error) {
      console.error('Error updating preferred tasks:', error);
    }
    navigation.goBack(); // Go back to Home screen after setting preferences
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>What kind of tasks do you want to do?</Text>
      {['work', 'read', 'exercise', 'rest'].map(task => (
        <TouchableOpacity key={task} onPress={() => handleSelectTask(task)} style={{ margin: 10 }}>
          <Text style={{ color: selectedTasks.includes(task) ? 'blue' : 'black' }}>{task}</Text>
        </TouchableOpacity>
      ))}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
