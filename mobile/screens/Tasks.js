import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
// import axios from 'axios';
// import { api } from '../config/Api';
import { useSession } from '../context/SessionContext';
import { width } from '../config/DeviceDimensions';

export default function TasksScreen() {
  const { user } = useSession();
  const [tasks, setTasks] = useState(
    user.preferredTasks || {
      Work: false,
      Reading: false,
      Exercise: false,
      Break: false,
    }
  );

  console.log('tasks', tasks);

  // const handleCompleteTask = async taskId => {
  //   try {
  //     await axios.put(`http://${api}/tasks/complete/${taskId}`);
  //     setTasks(tasks.map(task => (task._id === taskId ? { ...task, isCompleted: true } : task)));
  //   } catch (error) {
  //     console.error('Failed to complete task:', error);
  //   }
  // };
  setTasks({
    Work: true,
    Reading: true,
    Exercise: true,
    Break: true,
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Your Tasks</Text>
        {Object.entries(tasks).map(
          ([taskType, isActive]) =>
            isActive && (
              <Card key={taskType} style={styles.card}>
                <Card.Title title={taskType} subtitle="Task Details" />
                <Card.Content>
                  <Text>Task Type: {taskType}</Text>
                  <Text>Status: {isActive ? 'Active' : 'Inactive'}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="contained"
                    onPress={() => console.log(`Completing ${taskType}`)}
                    disabled={!isActive}
                  >
                    Complete Task
                  </Button>
                </Card.Actions>
              </Card>
            )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
  },
  card: {
    width: width * 0.4,
    marginVertical: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 0.2,
  },
});
