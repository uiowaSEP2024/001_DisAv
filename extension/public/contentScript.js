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
window.addEventListener('message', event => {
  // Check if the message is from a trusted source (optional)
  if (event.source !== window) return;

  // Extract message data
  const message = event.data;

  // Check message type
  if (message.type === 'LOGIN_SUCCESS') {
    const { token, user } = message;

    chrome.runtime.sendMessage({ type: 'LOGIN_SUCCESS', token: token, user: user });
  }
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Message received:', message);
  if (message.type === 'WEBSITE_BLOCKED') {
    // Store a variable in Chrome storage indicating that a website is blocked
    chrome.storage.local.set({ visible: true, site: message.site }, function() {
      console.log('Variable "visible" set to true in Chrome storage.');
    });
  }
});
