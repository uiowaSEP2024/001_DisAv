import Constants from 'expo-constants';

// Safely access the configuration
const expoConfig = Constants.expoConfig || {};

console.log('packagerOpts:', expoConfig);

const api =
  expoConfig.extra && expoConfig.extra.dev
    ? expoConfig.hostUri.split(`:`).shift().concat(`:3002`)
    : `api.example.com`;

console.log(api);

export { api };
