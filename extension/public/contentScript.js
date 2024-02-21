// contentScript.js
window.addEventListener(
  'message',
  event => {
    if (event.source === window && event.data.type === 'LOGIN_SUCCESS') {
      console.log('Login token:', event.data.token);
      // Store the token and user in the extension's local storage
      chrome.storage.local.set(
        {
          token: event.data.token,
          user: JSON.parse(event.data.user),
        },
        () => {
          console.log('Login information saved in extension.');
        }
      );
    }
  },
  false
);
