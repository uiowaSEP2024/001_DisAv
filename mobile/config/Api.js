import Constants from 'expo-constants';

const { expoConfig } = Constants;
console.log('packagerOpts:', expoConfig.extra);

const api = expoConfig.extra.dev
  ? expoConfig.hostUri.split(`:`).shift().concat(`:3002`)
  : `api.example.com`;
console.log(api);
export { api };
