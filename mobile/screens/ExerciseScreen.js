import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Card, Modal, Portal, Provider, Button, Text } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { api } from '../config/Api';
import { useSession } from '../context/SessionContext';
import { width, height } from '../config/DeviceDimensions';
import CustomAlert from '../components/CustomAlert';

const exercises = [
  { key: 'walk', description: 'Walk 100 steps', target: 100, duration: 1 },
  { key: 'pushups', description: 'Do 15 pushups', target: 15, duration: 1 },
  { key: 'jumpingJacks', description: 'Do 15 jumping jacks', target: 15, duration: 1 },
];

const ExerciseScreen = () => {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const { user } = useSession();
  const [currentTask, setCurrentTask] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [exerciseStartTime, setExerciseStartTime] = useState(null);

  useEffect(() => {
    const loadCurrentTask = async () => {
      const storedTask = await AsyncStorage.getItem('currentTask');
      console.log('Stored task:', storedTask);
      if (storedTask) {
        let task = JSON.parse(storedTask);
        if (Object.prototype.hasOwnProperty.call(task, 'task')) {
          task = task.task;
        }
        console.log('Parsed task:', task);
        try {
          console.log('Fetching task status:', task._id);
          const response = await axios.get(`http://${api}/task/get-by-id?id=${task._id}`);
          let fetchedTask = response.data;
          if (Object.prototype.hasOwnProperty.call(fetchedTask, 'task')) {
            fetchedTask = fetchedTask.task;
          }
          console.log('Fetched task:', fetchedTask);
          if (fetchedTask && !fetchedTask.isCompleted) {
            console.log('Setting current task:', fetchedTask);
            setCurrentTask(fetchedTask);
            setSelectedExercise(exercises.find(exercise => exercise.key === fetchedTask.taskType));
            setModalVisible(true);
          } else {
            setCurrentTask(null);
            setModalVisible(false);
            AsyncStorage.removeItem('currentTask');
          }
        } catch (error) {
          console.error('Failed to fetch task status:', error);
        }
      }
    };

    loadCurrentTask();
  }, []);

  useEffect(() => {
    if (currentTask) {
      console.log('Setting current task in AsyncStorage');
      AsyncStorage.setItem('currentTask', JSON.stringify(currentTask));
    } else {
      console.log('Removing current task from AsyncStorage');
      AsyncStorage.removeItem('currentTask');
    }
  }, [currentTask]);

  useEffect(() => {
    let stepCountSubscription = null;

    if (isFocused && selectedExercise?.key === 'walk') {
      stepCountSubscription = Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    }

    return () => {
      if (stepCountSubscription) {
        stepCountSubscription.remove();
      }
    };
  }, [isFocused, selectedExercise]);

  useEffect(() => {
    if (isFocused) {
      const interval = setInterval(() => {
        fetchTasks();
      }, 4000); // Adjusted to check for tasks every 4 seconds for demonstration

      return () => clearInterval(interval);
    }
  }, [isFocused]);

  const setCurrentTaskAndModel = async task => {
    setCurrentTask(task);
    setModalVisible(true);
  };

  const fetchTasks = async () => {
    const storedTask = await AsyncStorage.getItem('currentTask');
    if (storedTask) {
      console.log('A task is already in progress. Exiting fetchTasks.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://${api}/task/get-by-username?username=${user.username}`
      );
      const tasks = response.data.tasks;
      const currentActiveTask = tasks.find(task => !task.isCompleted);

      if (currentActiveTask) {
        const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
        console.log('Selected exercise:', randomExercise);
        setSelectedExercise(randomExercise);
        await setCurrentTaskAndModel(currentActiveTask);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeExercise = async () => {
    const now = new Date();
    if (!exerciseStartTime) {
      setExerciseStartTime(now);
    }

    const durationMillis = selectedExercise.duration * 60000; // Convert minutes to milliseconds
    const timeElapsed = now - new Date(exerciseStartTime);

    if (selectedExercise.key === 'walk' && currentStepCount < selectedExercise.target) {
      setAlertTitle('Incomplete Exercise');
      setAlertMessage(`You haven't reached the step goal of ${selectedExercise.target} steps yet.`);
      setAlertVisible(true);
      return;
    } else if (timeElapsed < durationMillis) {
      setAlertTitle('Incomplete Exercise');
      setAlertMessage(
        `Please continue doing the exercise for at least ${selectedExercise.duration} minute(s).`
      );
      setAlertVisible(true);
      return;
    }

    // If the exercise is completed and the duration is met
    setIsLoading(true);
    try {
      await axios.put(`http://${api}/task/update-completed`, {
        id: currentTask._id,
        isCompleted: true,
        endTime: new Date(),
      });
      console.log('Exercise task completed:', currentTask);
      setCurrentTask(null);
      setSelectedExercise(null);
      setModalVisible(false);
      setExerciseStartTime(null); // Reset the start time for the next exercise
      AsyncStorage.removeItem('currentTask');
    } catch (error) {
      console.error('Failed to mark task as completed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createExerciseTask = async exercise => {
    setIsLoading(true);
    try {
      await axios.post(`http://${api}/task/create`, {
        username: user.username,
        taskType: exercise.key,
        description: exercise.description,
        date: new Date(),
        startTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        endTime: new Date(new Date().getTime() + exercise.duration * 60000).toLocaleTimeString(
          'en-US',
          { hour12: false }
        ),
        duration: exercise.duration,
        points: 10,
        isCompleted: false,
      });
    } catch (error) {
      console.error('Failed to create exercise task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        {selectedExercise ? (
          <Card style={styles.card}>
            <Card.Title title={selectedExercise.description} />
            <Card.Content style={styles.cardContent}>
              {/* Display exercise details or progress */}
              {selectedExercise.key === 'walk' ? (
                <Text>
                  Steps: {currentStepCount} / {selectedExercise.target}
                </Text>
              ) : (
                <Text>Complete this exercise within {selectedExercise.duration} minute(s).</Text>
              )}
            </Card.Content>
            <Card.Actions>
              <Button onPress={completeExercise} style={styles.button}>
                Complete Exercise
              </Button>
            </Card.Actions>
          </Card>
        ) : (
          <Text>No exercise in progress</Text>
        )}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modal}
          >
            <Text>Exercise in progress...</Text>
          </Modal>
        </Portal>
        <Button
          onPress={() =>
            createExerciseTask(exercises[Math.floor(Math.random() * exercises.length)])
          }
          sx={{ margin: 10, color: 'white' }}
        >
          Create Exercise Task (Test)
        </Button>
        {isLoading && <Text>Loading...</Text>}
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          buttons={[{ text: 'OK', onPress: () => setAlertVisible(false) }]}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  card: {
    margin: 10,
    width: width * 0.4,
    height: height * 0.4,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'white',
  },
  button: {
    margin: 10,
    color: 'white',
  },
});
export default ExerciseScreen;
