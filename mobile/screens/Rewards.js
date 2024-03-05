import React, { useEffect, useState, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { useSession } from '../context/SessionContext';
import axios from 'axios';
import { api } from '../config/Api';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Headline } from 'react-native-paper';

export default function Rewards({ navigation }) {
  const { user } = useSession();
  const [totalPoints, setTotalPoints] = useState(0);
  const confettiRef = useRef();
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial value for scale: 0
  const rotateAnim = useRef(new Animated.Value(0)).current; // Initial value for rotation: 0

  async function fetchUserTasks() {
    try {
      const response = await axios.get(
        `http://${api}/task/get-by-username?username=${user.username}`
      );
      const userTasks = response.data.tasks;
      let points = 0;
      userTasks.forEach(task => {
        if (task.isCompleted) {
          points += task.points;
        }
      });
      setTotalPoints(points);
      confettiRef.current.start();
      // Start rotation animation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        // After the rotation, reset the rotation to 0 without animation
        rotateAnim.setValue(0);
      });
      // Start scale animation
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
    }
  }, [user, scaleAnim]);

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
    color: 'white',
  },
});
