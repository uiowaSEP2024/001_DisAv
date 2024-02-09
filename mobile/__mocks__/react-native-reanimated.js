// __mocks__/react-native-reanimated.js
export const Easing = {
  bezier: jest.fn().mockImplementation((x1, y1, x2, y2) => jest.fn()),
  // Mock other easing functions as needed
};

// Mock other exports from react-native-reanimated as needed
