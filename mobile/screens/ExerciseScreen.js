import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Card, Provider, Button, Text } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useSession } from '../context/SessionContext';
import { width, height } from '../config/DeviceDimensions';
import CustomAlert from '../components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../config/Api';

const exercises = [
  { key: 'walk', description: 'Walk 500 steps', target: 500, duration: 1 },
  { key: 'pushups', description: 'Do 15 pushups', target: 15, duration: 1 },
  { key: 'jumpingJacks', description: 'Do 15 jumping jacks', target: 15, duration: 1 },
];

const ExerciseScreen = () => {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const { user, currentTask, setCurrentTask } = useSession();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [exerciseStartTime, setExerciseStartTime] = useState(null);

  useEffect(() => {
    if (isFocused && currentTask) {
      const exercise = exercises[Math.floor(Math.random() * exercises.length)];
      if (exercise) {
        setSelectedExercise(exercise);
        // Set the exercise start time as soon as the exercise is selected
        setExerciseStartTime(new Date());
      }
    }
  }, [isFocused, currentTask]);

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

  const completeExercise = async () => {
    const now = new Date();

    if (!exerciseStartTime) {
      console.error('Exercise start time is not set.');
      return;
    }

    const durationMillis = selectedExercise.duration * 60000; // Convert minutes to milliseconds
    const timeElapsed = now - new Date(exerciseStartTime).getTime();

    console.log('Time elapsed:', timeElapsed);
    console.log('Duration:', durationMillis);

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
        {selectedExercise && currentTask ? (
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
