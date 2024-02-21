import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const login = user => {
    sessionStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
  );
};
