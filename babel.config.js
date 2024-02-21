module.exports = {
  // Other ESLint configuration options...
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  },
  // Other ESLint configuration options...
};
