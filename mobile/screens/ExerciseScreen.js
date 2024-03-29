import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Card, Modal, Portal, Provider } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { api } from '../config/Api';
import { useSession } from '../context/SessionContext';

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
    const interval = setInterval(() => {
      fetchTasks();
    }, 1000); // Check for tasks every 1 second

    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://${api}/task/get-by-username?username=${user.username}`
      );
      console.log('Fetched tasks:', response.status);
      const tasks = response.data.tasks;
      const currentActiveTask = tasks.find(task => !task.isCompleted);
      if (currentActiveTask && !currentTask && currentActiveTask._id !== currentTask?._id) {
        // Randomly select an exercise
        const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
        setSelectedExercise(randomExercise);
        setModalVisible(true);
        setCurrentTask(currentActiveTask);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeExercise = async () => {
    // Ensure step goal is reached for walking tasks or minimum duration has passed for others
    if (selectedExercise.key === 'walk' && currentStepCount < selectedExercise.target) {
      //   alert('Step goal not reached');
      return;
    }

    // if (selectedExercise.key !== 'walk' && selectedExercise.duration > 0) {
    setTimeout(async () => {
      // Declare the callback as an async function
      // alert('Exercise completed');
      console.log('Exercise task completed:', currentTask);
      await axios.put(`http://${api}/task/update-completed`, {
        id: currentTask._id,
        isCompleted: true,
        endTime: new Date(),
      });
      setModalVisible(false);
      setCurrentTask(null);
      // Here, update the task as completed in your backend
    }, selectedExercise.duration * 1000); // Convert duration to milliseconds
  };

  //   const createExerciseTask = async exercise => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.post(`http://${api}/task/create`, {
  //         username: user.username,
  //         taskType: exercise.key,
  //         description: exercise.description,
  //         date: new Date(),
  //         startTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
  //         endTime: new Date(new Date().getTime() + exercise.duration * 60000).toLocaleTimeString(
  //           'en-US',
  //           { hour12: false }
  //         ),
  //         duration: exercise.duration,
  //         points: 10,
  //         isCompleted: false,
  //       });

  //       setSelectedExercise({ ...exercise, _id: response.data.task._id });
  //     } catch (error) {
  //       console.error('Failed to create exercise task:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  return (
    <Provider>
      <View style={styles.container}>
        <Card>
          <Card.Title title="Exercise Task" />
          <Card.Content>
            <Text style={styles.text}>Current step count: {currentStepCount}</Text>
          </Card.Content>
        </Card>
        <Portal>
          <Modal visible={modalVisible} dismissable={false} contentContainerStyle={styles.modal}>
            {selectedExercise && selectedExercise.key === 'walk' ? (
              <>
                <Text style={styles.text}>{selectedExercise.description}</Text>
                <Text style={styles.text}>Pedometer count: {currentStepCount}</Text>
              </>
            ) : (
              <Text style={styles.text}>
                {selectedExercise ? selectedExercise.description : 'Loading exercise...'}
              </Text>
            )}
            <Button
              title="Complete Exercise"
              onPress={completeExercise}
              testID="complete-exercise-button"
              disabled={
                isLoading ||
                (selectedExercise?.key !== 'walk' &&
                  selectedExercise?.duration * 1000 >
                    new Date().getTime() - new Date(selectedExercise?.startTime).getTime())
              }
            />
          </Modal>
        </Portal>
        {/* <Button
          title="Create Exercise Task (Test)"
          onPress={() =>
            createExerciseTask(exercises[Math.floor(Math.random() * exercises.length)])
          }
        /> */}
      </View>
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    fontSize: 16,
    color: 'black', // Changed from white to ensure readability
    textAlign: 'center',
  },
});
export default ExerciseScreen;
