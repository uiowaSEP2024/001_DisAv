import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused
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

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const loadAndPlaySound = async music => {
      // Unload any existing sound first
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
      // Unload the sound when the component unmounts or the currentTask changes
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentTask, isFocused]); // Depend on currentTask and isFocused so this effect runs every time the currentTask changes or the focus state changes.

  const fetchTasks = async () => {
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
    }
  };

  async function createRandomTaskForUser() {
    try {
      // Assuming user.preferredTasks is an array of task types like ['Work', 'Reading']
      const preferredTasks = user.preferredTasks;
      if (!preferredTasks || preferredTasks.length === 0) {
        return;
      }

      // Check if there's an existing active task
      const userTasks = await axios.get(
        `http://${api}/task/get-by-username?username=${user.username}`
      );

      for (let i = 0; i < userTasks.length; i++) {
        if (userTasks[i].isCompleted === false) {
          return;
        }
      }
      // Select a random task from preferred tasks
      let randomTaskType;
      do {
        const preferredTaskKeys = Object.keys(preferredTasks).filter(key => preferredTasks[key]);
        randomTaskType = preferredTaskKeys[Math.floor(Math.random() * preferredTaskKeys.length)];
      } while (randomTaskType === 'Work' || randomTaskType === 'Break');
      // Create a new task
      await axios.post(`http://${api}/task/create`, {
        username: user.username,
        taskType: randomTaskType,
        date: new Date(), // Set the date as today, adjust as needed
        startTime: new Date().toLocaleTimeString('en-US', { hour12: false }), // Current time
        endTime: new Date(new Date().getTime() + 10 * 60000).toLocaleTimeString('en-US', {
          hour12: false,
        }), // 10 minutes later
        duration: 10,
        points: 10, // Example points, adjust as needed
      });

      // wait to three seconds to fetch the tasks again
      setTimeout(() => {
        fetchTasks();
      }, 3000);
    } catch (error) {
      console.error('Failed to create random task for user:', error);
    }
  }

  const markTaskAsCompleted = async taskId => {
    try {
      await axios.put(`http://${api}/task/update`, {
        username: user.username,
        id: taskId,
        isCompleted: true,
        endTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
      });
      setTimeout(() => {
        fetchTasks();
      }, 3000);
      // stop sound
      if (sound) {
        sound.unloadAsync();
      }
    } catch (error) {
      console.error('Failed to mark task as completed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Your Tasks</Text>
        {currentTask && (
          <Card style={styles.card}>
            {/* Use Card.Content for better control and to avoid overflow issues */}
            <Card.Content style={styles.cardContent}>
              <ImageBackground
                source={taskAssets[currentTask.taskType]?.gif}
                style={styles.imageBackground}
                resizeMode="cover"
              >
                {/* Additional content and styling can go here */}
                <Text style={styles.cardTitle}>{currentTask.taskType}</Text>
                <Text style={styles.cardSubtitle}>Start Time: {currentTask.startTime}</Text>
                <Button
                  style={styles.completeButton}
                  testID="complete-task-button"
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
