module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    // Mock static asset imports which Jest can't handle
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testEnvironment: 'jsdom', // Use jsdom to simulate browser environment
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  },

};
