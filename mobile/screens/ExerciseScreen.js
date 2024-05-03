import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Card, Provider, Button, Text } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useSession } from '../context/SessionContext';
import { width } from '../config/DeviceDimensions';
import CustomAlert from '../components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../config/Api';

const exercises = [
  { key: 'walk', description: 'Walk 20 steps', target: 20, duration: 1 },
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
    const fetchAndSetExercise = async () => {
      console.log('Current task:', currentTask);
      console.log('Selected exercise:', selectedExercise);
      if (isFocused && currentTask && !selectedExercise) {
        // Check if there's no selectedExercise already
        console.log('Current task:', currentTask);
        let exercise;
        const storedExercise = await AsyncStorage.getItem('selectedExercise');
        if (storedExercise) {
          console.log('Stored exercise:', storedExercise);
          exercise = JSON.parse(storedExercise);
        } else {
          exercise = exercises[Math.floor(Math.random() * exercises.length)];
          console.log('Random exercise:', exercise);
          await AsyncStorage.setItem('selectedExercise', JSON.stringify(exercise));
        }
        setSelectedExercise(exercise);
        setExerciseStartTime(new Date()); // Set the start time only when a new exercise is selected
      }
    };
    fetchAndSetExercise();
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
    const timeElapsed = Math.floor((now - new Date(exerciseStartTime).getTime()) / 1000); // Convert to seconds

    console.log('Time elapsed (seconds):', timeElapsed);
    console.log('Duration (seconds):', durationMillis / 1000);

    if (selectedExercise.key === 'walk' && currentStepCount < selectedExercise.target) {
      setAlertTitle('Incomplete Exercise');
      setAlertMessage(`You haven't reached the step goal of ${selectedExercise.target} steps yet.`);
      setAlertVisible(true);
      return;
    } else if (timeElapsed * 1000 < durationMillis) {
      // Compare milliseconds
      setAlertTitle('Incomplete Exercise');
      setAlertMessage(
        `Please continue doing the exercise for at least ${selectedExercise.duration} minute(s). You have only done it for ${Math.floor(
          timeElapsed / 60
        )} minute(s) and ${timeElapsed % 60} second(s) so far.`
      );
      setAlertVisible(true);
      return;
    }

    // If the exercise is completed and the duration iscompleted and the duration is met, you can proceed with marking the exercise as complete. Here's how you might continue:

    // Exercise completion logic
    setIsLoading(true);
    try {
      // Assuming you have an API endpoint to mark an exercise as complete
      const response = await axios.put(`${api}/task/update-completed`, {
        id: currentTask._id,
        isCompleted: true,
        endTime: new Date(),
        points: 15,
        taskType: 'Exercise',
      });

      await axios.put(`${api}/user/update-frozen-browsing`, {
        username: user.username,
        frozenBrowsing: false,
        nextFrozen: new Date(new Date().getTime() + user.taskFrequency),
      });

      if (response.status === 200) {
        setAlertTitle('Exercise Complete');
        setAlertMessage('Congratulations on completing your exercise!');
        setAlertVisible(true);

        // Reset exercise state
        setSelectedExercise(null);
        setCurrentStepCount(0);
        setExerciseStartTime(null);
        setCurrentTask(null);
        await AsyncStorage.removeItem('selectedExercise');
        await AsyncStorage.removeItem('currentTask');
      } else {
        // Handle failure (e.g., API returned an error)
        setAlertTitle('Error');
        setAlertMessage('There was a problem completing your exercise. Please try again.');
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Complete exercise error:', error);
      setAlertTitle('Error');
      setAlertMessage('There was a problem completing your exercise. Please try again.');
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const createExerciseTask = async exercise => {
    setIsLoading(true);
    try {
      await axios.post(`${api}/task/create`, {
        username: user.username,
        taskType: 'Exercise',
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
            <Card.Title title={selectedExercise.description} titleStyle={styles.cardTitle} />
            <Card.Content style={styles.cardContent}>
              {selectedExercise.key === 'walk' ? (
                <Text style={styles.cardText}>
                  Steps: {currentStepCount} / {selectedExercise.target}
                </Text>
              ) : (
                <Text style={styles.cardText}>
                  Complete this exercise within {selectedExercise.duration} minute(s).
                </Text>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={completeExercise}
                style={[styles.button, { backgroundColor: 'black' }]} // Ensure background color is black
                labelStyle={{ color: 'white' }} // Ensure text color is white
              >
                Complete Exercise
              </Button>
            </Card.Actions>
          </Card>
        ) : (
          <Text style={styles.noExerciseText}>No exercise in progress</Text>
        )}
        <Button
          onPress={() =>
            createExerciseTask(exercises[Math.floor(Math.random() * exercises.length)])
          }
          mode="contained"
          style={[styles.button, { backgroundColor: 'black' }]} // Ensure background color is black
          labelStyle={{ color: 'white' }} // Ensure text color is white
        >
          Create Exercise Task (Test)
        </Button>
        {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
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
    width: width * 0.4, // Adjusted for better screen utilization
    backgroundColor: 'white', // Ensuring card background is white
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTitle: {
    color: 'black',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    color: 'black',
  },
  button: {
    margin: 10,
    width: width * 0.3, // Adjusted for better screen utilization
    backgroundColor: 'black', // Button background to black for contrast
    color: 'white', // Button text color to white for readability
  },
  noExerciseText: {
    color: 'black',
  },
  loadingText: {
    color: 'black',
  },
});
export default ExerciseScreen;
