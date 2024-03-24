import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useSession } from '../context/SessionContext';
import { height, width } from '../config/DeviceDimensions';
import { api } from '../config/Api';
import { Audio } from 'expo-av';

const taskAssets = {
  Exercise: {
    gif: require('../assets/workoutGif.gif'),
    music: require('../assets/workoutSound.mp3'),
  },
  Reading: {
    gif: require('../assets/readingGif.gif'),
    music: require('../assets/readingSound.mp3'),
  },
};

export default function TasksScreen() {
  const { user } = useSession();
  const [currentTask, setCurrentTask] = useState(null);
  const isFocused = useIsFocused();
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const loadAndPlaySound = async music => {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      if (currentTask && taskAssets[currentTask.taskType]?.music && isFocused) {
        const { sound: newSound } = await Audio.Sound.createAsync(music);
        await newSound.playAsync();
        setSound(newSound);
      }
    };

    if (currentTask && taskAssets[currentTask.taskType]?.music) {
      loadAndPlaySound(taskAssets[currentTask.taskType].music).catch(err => console.error(err));
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentTask, isFocused]);

  const fetchTasks = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        `http://${api}/task/get-by-username?username=${user.username}`
      );
      const tasks = response.data.tasks;
      const activeTask = tasks.find(task => !task.isCompleted);
      if (!activeTask) {
        createRandomTaskForUser();
      } else {
        setCurrentTask(activeTask);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  async function createRandomTaskForUser() {
    setIsLoading(true); // Start loading
    try {
      const preferredTasks = user.preferredTasks;
      if (!preferredTasks || preferredTasks.length === 0) {
        setIsLoading(false); // End loading early if no preferred tasks
        return;
      }

      const userTasks = await axios.get(
        `http://${api}/task/get-by-username?username=${user.username}`
      );

      for (let i = 0; i < userTasks.length; i++) {
        if (userTasks[i].isCompleted === false) {
          setIsLoading(false); // End loading early if there's an active task
          return;
        }
      }

      let randomTaskType;
      do {
        const preferredTaskKeys = Object.keys(preferredTasks).filter(key => preferredTasks[key]);
        randomTaskType = preferredTaskKeys[Math.floor(Math.random() * preferredTaskKeys.length)];
      } while (randomTaskType === 'Work' || randomTaskType === 'Break');

      await axios.post(`http://${api}/task/create`, {
        username: user.username,
        taskType: randomTaskType,
        date: new Date(),
        startTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        endTime: new Date(new Date().getTime() + 10 * 60000).toLocaleTimeString('en-US', {
          hour12: false,
        }),
        duration: 10,
        points: 10,
      });

      // wait to three seconds to fetch the tasks again
      setTimeout(() => {
        fetchTasks();
      }, 3000);
    } catch (error) {
      console.error('Failed to create random task for user:', error);
    } finally {
      setIsLoading(false); // Ensure loading state is reset even if there's an error
    }
  }

  const markTaskAsCompleted = async taskId => {
    setIsLoading(true); // Indicate start of task completion process
    try {
      await axios.put(`http://${api}/task/update`, {
        username: user.username,
        id: taskId,
        isCompleted: true,
        endTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
      });

      // Optionally wait for a few seconds before fetching tasks again
      setTimeout(() => {
        fetchTasks();
      }, 3000);
    } catch (error) {
      console.error('Failed to mark task as completed:', error);
    } finally {
      setIsLoading(false); // Reset loading state regardless of outcome
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {!isLoading && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Your Tasks</Text>
          {currentTask && (
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <ImageBackground
                  source={taskAssets[currentTask.taskType]?.gif}
                  style={styles.imageBackground}
                  resizeMode="cover"
                >
                  <Text style={styles.cardTitle}>{currentTask.taskType}</Text>
                  <Text style={styles.cardSubtitle}>Start Time: {currentTask.startTime}</Text>
                  <Button
                    style={styles.completeButton}
                    mode="contained"
                    onPress={() => markTaskAsCompleted(currentTask._id)}
                  >
                    Complete Task
                  </Button>
                </ImageBackground>
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    // width: width * 0.4, // Adjusted for demonstration
    // height: height * 1.3, // Adjusted for demonstration
    // overflow: 'scroll', // Ensures the background image does not bleed outside the card boundaries
  },
  cardContent: {
    flex: 1, // This will make sure the content fills the card
    width: width * 0.4, // Adjusted for demonstration
    height: height * 1.3, // Adjusted for demonstration
  },
  imageBackground: {
    flex: 1, // This will make sure the image fills the entire space of its container
    // No need to set width and height here
    // justifyContent: 'flex-end', // Aligns button to the bottom
  },
  cardTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)', // Ensure text is readable on any background
    padding: 5,
    marginBottom: 5, // Space between title and subtitle
  },
  cardSubtitle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)', // Ensure text is readable on any background
    padding: 5,
  },
  completeButton: {
    // alignSelf: 'flex-end', // Align button to the right
    margin: 10, // Distance from the edges
    position: 'absolute',
    bottom: 15,
    right: 10,
    width: width * 0.16, // Adjusted for demonstration
  },
});
