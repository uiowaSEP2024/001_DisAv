import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { api } from '../config/Api';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      const storedTask = await AsyncStorage.getItem('currentTask');
      if (storedTask) {
        setCurrentTask(JSON.parse(storedTask));
        return;
      }

      try {
        console.log(
          `Fetching tasks via url https://${api}/task/get-by-username?username=${user.username}`
        );
        const response = await axios.get(
          `https://${api}/task/get-by-username?username=${user.username}`
        );
        console.log('Fetched tasks:', response.data.tasks);
        const tasks = response.data.tasks;
        const activeTask = tasks.find(task => !task.isCompleted);

        console.log('Active task:', activeTask);

        if (activeTask) {
          setCurrentTask(activeTask);
          await AsyncStorage.setItem('currentTask', JSON.stringify(activeTask));
          // Send a notification if the task is not completed
          if (!activeTask.isCompleted) {
            await sendNotification();
          }
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    const intervalId = setInterval(fetchTasks, 7000); // Check for tasks every 7 seconds

    fetchTasks(); // Initial fetch

    return () => clearInterval(intervalId);
  }, [user]);

  const login = async userData => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    setCurrentTask(null);
    await AsyncStorage.removeItem('currentTask');
  };

  const saveUser = async userData => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to send a notification
  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Reminder',
        body: 'You have incomplete tasks. Open the app to complete them.',
      },
      trigger: null, // sends it immediately
    });
  };

  return (
    <SessionContext.Provider value={{ user, saveUser, currentTask, login, logout, setCurrentTask }}>
      {children}
    </SessionContext.Provider>
  );
};
