import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userExerciseTaskActive, setUserExerciseTaskActive] = useState(null);

  // Load the user session from AsyncStorage when the app starts
  useEffect(() => {
    const loadSession = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedUserExerciseTaskActive = await AsyncStorage.getItem('userExerciseTaskActive');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setUserExerciseTaskActive(JSON.parse(storedUserExerciseTaskActive));
      }
    };

    loadSession();
  }, []);

  const login = async userData => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const saveUser = async userData => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const saveUserExerciseTaskActive = async userExerciseTaskActiveData => {
    setUserExerciseTaskActive(userExerciseTaskActiveData);
    await AsyncStorage.setItem(
      'userExerciseTaskActive',
      JSON.stringify(userExerciseTaskActiveData)
    );
  };

  return (
    <SessionContext.Provider
      value={{ user, login, logout, saveUser, userExerciseTaskActive, saveUserExerciseTaskActive }}
    >
      {children}
    </SessionContext.Provider>
  );
};
