module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      // 'module:react-native-dotenv',
    ],
    sourceMaps: true,
    plugins: ['@babel/transform-react-jsx-source'],
  };
};
