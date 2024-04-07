import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Make sure to import axios
import { api } from '../config/Api'; // Adjust the path as necessary

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
        const response = await axios.get(
          `http://${api}/task/get-by-username?username=${user.username}`
        );
        const tasks = response.data.tasks;
        const activeTask = tasks.find(task => !task.isCompleted);

        if (activeTask) {
          setCurrentTask(activeTask);
          await AsyncStorage.setItem('currentTask', JSON.stringify(activeTask));
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    const intervalId = setInterval(fetchTasks, 10000); // Check for tasks every 10 seconds

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
    AsyncStorage.removeItem('currentTask');
  };

  return (
    <SessionContext.Provider value={{ user, currentTask, login, logout, setCurrentTask }}>
      {children}
    </SessionContext.Provider>
  );
};
