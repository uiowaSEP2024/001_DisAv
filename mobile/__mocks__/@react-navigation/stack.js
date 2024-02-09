import React from 'react';

export const createStackNavigator = jest.fn().mockImplementation(() => ({
  Navigator: ({ children }) => <>{children}</>,
  Screen: ({ children }) => <>{children}</>,
}));
