// background.js
console.log('Background script is running.'); // This will log to the background page's console
// Grab user data from the API
let user;
chrome.storage.local.get(['user'], result => {
  user = result.user;
  if (user) {
    console.log('User:', user);
    // Use the retrieved token and user data as needed
  } else {
    console.log('Token or user data not found in storage.');
  }
});
let firstTime = true;
let interval;
function openWebsite() {
  console.log('openWebsite called'); // This will log to the background page's console
  const website = 'http://localhost:3000/tasks';
  chrome.tabs.create({ url: website });
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Perform actions based on the message
  if (message.action === 'mouseActive') {
    // Display an alert or perform other actions
    console.log('User is active');
  }
});

console.log('Background script is running.');
chrome.idle.setDetectionInterval(300);
chrome.idle.onStateChanged.addListener(function (state) {
  if (state === 'active') {
    console.log('User is active!');
    const currentDate = new Date();
    updateFrozenBrowsing({
      username: user.username,
      nextFrozen: new Date(currentDate.getTime() + user.taskFrequency),
      frozenBrowsing: false,
    });
    user.frozenBrowsing = false;
  } else {
    console.log('User is idle.'); //stop timer
    updateFrozenBrowsing({ nextFrozen: null });
  }
});

function checkIdleState() {
  chrome.idle.queryState(15, function (state) {
    console.log(user, 'USER');
    if (firstTime && state === 'active' && user) {
      const currentDate = new Date();
      updateFrozenBrowsing({
        username: user.username,
        nextFrozen: new Date(currentDate.getTime() + user.taskFrequency),
      }); //Update the nextFrozen time on firststate query because there would be no state change since you arent idle
      firstTime = false;
      interval = setInterval(checkNextFrozen, user.taskFrequency);
    }
  });
}

function updateFrozenBrowsing(data) {
  user.nextFrozen = data.nextFrozen;
  console.log('nextFrozen updated for the user:', data.nextFrozen);
  fetch('http://localhost:3002/user/update-frozen-browsing', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      user = responseData.user;
      console.log('API response:', user);
    })
    .catch(error => {
      console.error('Error updating frozen browsing:', error);
    });
}
function handleStorageChange(changes, namespace) {
  console.log('IN On Chnage', changes);
  firstTime = true;
  if (interval) {
    clearInterval(interval); // stop existing interval on new login
  }
  if (namespace === 'local') {
    for (let key in changes) {
      if (key === 'user') {
        const newUserValue = changes[key].newValue;
        if (newUserValue) {
          user = newUserValue;
          user.frozenBrowsing = newUserValue.frozenBrowsing;
          let currentDate = new Date();
          updateFrozenBrowsing({
            username: user.username,
            nextFrozen: new Date(currentDate.getTime() + user.taskFrequency),
            frozenBrowsing: false,
          });
        } else {
          user = null;
        }
      }
    }
  }
}
chrome.storage.onChanged.addListener(handleStorageChange);

//checkIdleState();
setInterval(checkIdleState, 1000);

function checkNextFrozen() {
  console.log('checking', user.frozenBrowsing, user.nextFrozen);
  if (user && user.nextFrozen) {
    console.log('checking again1', user.nextFrozen);
    const nextFrozenTime = new Date(user.nextFrozen).getTime();
    const currentTime = new Date().getTime();
    console.log('checking again2', nextFrozenTime, currentTime, nextFrozenTime <= currentTime);
    if (user.nextFrozen && currentTime >= nextFrozenTime) {
      console.log('Current time is past nextFrozen:', user.nextFrozen);
      openWebsite();
      user.frozenBrowsing = true;
      updateFrozenBrowsing({ username: user.username, nextFrozen: null, frozenBrowsing: true }); //Update the nextFrozen time on firststate query because there would be no state change since you arent idle
      createTask({
        username: user.username,
        taskType: 'break',
        date: new Date(),
        startTime: currentTime,
        endTime: currentTime,
        duration: 20000,
        points: 10,
      }); //TODO specify task duration
    }
  }
}

function createTask(data) {
  fetch('http://localhost:3002/task/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      console.log('API response:', responseData);
    })
    .catch(error => {
      console.error('Error creating task:', error);
    });
}

// redirect all search urls

chrome.webNavigation.onBeforeNavigate.addListener(
  function (details) {
    const url = new URL(details.url);
    if (url.pathname === '/' && url.searchParams.has('q') && user.frozenBrowsing) {
      const redirectUrl = 'http://localhost:3000/tasks';
      chrome.tabs.update(details.tabId, { url: redirectUrl });
    }
  },
  { url: [{ schemes: ['http', 'https'] }] }
);
// chrome.runtime.onInstalled.addListener(() => {
//   console.log('Extension installed, setting timeout...'); // This will log when the extension is installed
//   setTimeout(() => {
//     console.log('Timeout completed, opening website...'); // This will log right before opening the website
//     openWebsite();
//   }, 6000);
// });
