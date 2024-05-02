import Constants from 'expo-constants';

// Access your variables like this
const apiUrl = Constants.expoConfig.extra.API_URL;
const apiType = Constants.expoConfig.extra.API_TYPE;

console.log('apiUrl:', apiUrl);
console.log('apiType:', apiType);

// Safely access the configuration
const expoConfig = Constants.expoConfig || {};

console.log('packagerOpts:', expoConfig);
let api = apiUrl;
if (apiType === 'development') {
  console.log('Development API');
  api =
    expoConfig.extra && expoConfig.extra.dev
      ? expoConfig.hostUri.split(`:`).shift().concat(`:3004`)
      : `api.example.com`;
}
// else {
//   console.log('Production API');
//   api = apiUrl;
// }

// console.log(api);

export { api };
