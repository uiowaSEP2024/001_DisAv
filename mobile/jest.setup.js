import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Mocks for react-native components and modules
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// // Setup for handling animations
// global.requestAnimationFrame = ({callback}) => {
//   setTimeout(callback, 0);
// };

// // Clear mocks after each test
// afterEach(() => {
//   jest.clearAllMocks();
// });
