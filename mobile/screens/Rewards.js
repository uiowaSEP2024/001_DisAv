import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSession } from '../context/SessionContext';
import axios from 'axios';
import { api } from '../config/Api';

export default function Rewards({ navigation }) {
  const { user } = useSession();
  const [totalPoints, setTotalPoints] = useState(0);

  async function fetchUserTasks() {
    const response = await axios.get(
      `http://${api}/task/get-by-username?username=${user.username}`
    );
    const userTasks = response.data.tasks;
    console.log('User tasks:', userTasks);
    for (let i = 0; i < userTasks.length; i++) {
      if (userTasks[i].isCompleted === true) {
        console.log('Adding points:', userTasks[i].points);
        setTotalPoints(totalPoints + userTasks[i].points);
      }
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserTasks();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rewards Screen</Text>
      <Text style={styles.points}>Total Points: {totalPoints}</Text>
    </View>
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
  },
  points: {
    fontSize: 20,
  },
});
