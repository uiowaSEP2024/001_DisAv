import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import axios from 'axios';
import { api } from '../config/Api';
import { useSession } from '../context/SessionContext';
import { width } from '../config/DeviceDimensions';

export default function TasksScreen() {
  const { user } = useSession();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://${api}/tasks/user/${user._id}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  const handleCompleteTask = async taskId => {
    try {
      await axios.put(`http://${api}/tasks/complete/${taskId}`);
      setTasks(tasks.map(task => (task._id === taskId ? { ...task, isCompleted: true } : task)));
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Your Tasks</Text>
        {tasks.map(task => (
          <Card key={task._id} style={styles.card}>
            <Card.Title
              title={task.taskType}
              subtitle={`Due: ${new Date(task.date).toLocaleDateString()}`}
            />
            <Card.Content>
              <Text>Start Time: {task.startTime}</Text>
              <Text>End Time: {task.endTime}</Text>
              <Text>Duration: {task.duration} minutes</Text>
              <Text>Points: {task.points}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => handleCompleteTask(task._id)}
                disabled={task.isCompleted}
              >
                {task.isCompleted ? 'Completed' : 'Complete Task'}
              </Button>
            </Card.Actions>
          </Card>
        ))}
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
    width: width * 0.9,
    marginVertical: 10,
  },
});
