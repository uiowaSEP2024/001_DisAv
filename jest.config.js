module.exports = {
  projects: ['<rootDir>/web', '<rootDir>/extension', '<rootDir>/server', '<rootDir>/mobile'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
