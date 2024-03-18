// AuthProvider with loading state
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // add a loading state

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    setIsLoggedIn(!!user);
    setLoading(false); // set loading to false after checking the user's logged-in state
  }, []);

  const login = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {!loading && children} {/* Render children when not loading */}
    </AuthContext.Provider>
  );
};
