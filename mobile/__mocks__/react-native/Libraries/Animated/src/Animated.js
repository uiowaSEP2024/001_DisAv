const Animated = jest.requireActual('react-native/Libraries/Animated/src/Animated');

// Mock the specific functions or properties you use, or provide a simple mock.
// This example provides a simple mock for `timing` as an illustration.
Animated.timing = jest.fn(() => ({
  start: jest.fn(),
}));

module.exports = Animated;
