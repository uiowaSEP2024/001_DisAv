import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { api } from '../config/Api';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [lastFetchedTaskTime, setLastFetchedTaskTime] = useState(0);

  useEffect(() => {
    const loadSession = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadSession();
  }, []);

  const fetchUser = useCallback(async () => {
    if (!user) return;

    try {
      const responseUser = await axios.get(`${api}/user/get-by-username?username=${user.username}`);
      if (responseUser.data.user) {
        saveUser(responseUser.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const now = Date.now();
      if (now - lastFetchedTaskTime < 7000) return; // Prevent fetching if last fetch was less than 7 seconds ago
      setLastFetchedTaskTime(now);

      const storedTask = await AsyncStorage.getItem('currentTask');
      if (storedTask) {
        const parsedTask = JSON.parse(storedTask);
        setCurrentTask(parsedTask);
        if (!parsedTask.isCompleted) {
          return; // If the stored task is not completed, no need to fetch new tasks
        }
      }

      console.log('Fetching tasks...');

      try {
        const response = await axios.get(`${api}/task/get-by-username?username=${user.username}`);
        const tasks = response.data.tasks;
        const activeTask = tasks.find(task => !task.isCompleted);

        if (activeTask) {
          setCurrentTask(activeTask);
          await AsyncStorage.setItem('currentTask', JSON.stringify(activeTask));
          if (!activeTask.isCompleted) {
            await sendNotification();
            await fetchUser(); // Fetch user data only if there is an active task that is not completed
          }
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    const intervalId = setInterval(fetchTasks, 7000);
    fetchTasks(); // Initial fetch

    return () => clearInterval(intervalId);
  }, [user, lastFetchedTaskTime, fetchUser]);

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
