import React, { useEffect, useState, useRef } from 'react';
import { Animated, Easing, StyleSheet, ScrollView, View, Text } from 'react-native';
import { useSession } from '../context/SessionContext';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { api } from '../config/Api';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Headline } from 'react-native-paper';

export default function Rewards({ navigation }) {
  const { user } = useSession();
  const isFocused = useIsFocused(); // This hook returns true if the screen is focused, false otherwise.
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const confettiRef = useRef();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  async function fetchUserTasks() {
    if (!user) {
      return;
    } else if (!isFocused) {
      return;
    }
    try {
      const response = await axios.get(
        `http://${api}/task/get-by-username?username=${user.username}`
      );
      const userTasks = response.data.tasks;
      let points = 0;
      const completed = [];
      userTasks.forEach(task => {
        if (task.isCompleted) {
          points += task.points;
          completed.push(task);
        }
      });
      setTotalPoints(points);
      // Sort completed tasks by date, most recent first
      completed.sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted));
      console.log('Completed tasks:', completed);
      setCompletedTasks(completed);
      confettiRef.current.start();
      // Start animations
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => rotateAnim.setValue(0));
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error fetching total points:', error);
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserTasks();
      console.log('Fetched user tasks...');
    }
  }, [user, isFocused]);

  if (!user) {
    return null;
  }

  const animatedStyle = {
    transform: [
      { scale: scaleAnim },
      {
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#ff3b30', '#007aff']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} ref={confettiRef} fadeOut={true} />
      <Headline style={styles.title}>Rewards Screen</Headline>
      <Animated.Text style={[styles.points, animatedStyle]}>
        Total Points: {totalPoints}
      </Animated.Text>
      <ScrollView style={styles.taskList}>
        {completedTasks.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <Text style={styles.taskText}>
              Date: {new Date(task.date).toLocaleDateString()} | Time:{' '}
              {new Date('1970-01-01T' + task.startTime + 'Z').toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}{' '}
              -{' '}
              {new Date('1970-01-01T' + task.endTime + 'Z').toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </Text>
            <Text style={styles.taskText}>Type: {task.taskType}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    color: 'white',
  },
  points: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  taskList: {
    width: '100%',
    maxHeight: 300,
  },
  taskItem: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
});
