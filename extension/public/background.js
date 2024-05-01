// background.js
console.log('Background script is running.'); // This will log to the background page's console
// Grab user data from the API
let user;
let interval = null;
// Retrieve user data from Chrome storage

function openWebsite() {
  console.log('openWebsite called'); // This will log to the background page's console
  const website = 'http://localhost:3000/break-task';
  chrome.tabs
    .update({ url: website, active: true })
    .then(() => {
      console.log('Opened website');
    })
    .catch(error => {
      console.error('Error updating tab:', error);
    });
}

function updateFrozenBrowsing(data) {
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
  if (namespace === 'local') {
    for (let key in changes) {
      if (key === 'user') {
        const newUserValue = changes[key].newValue;
        console.log(
          user?.username,
          newUserValue?.username,
          user?.username !== newUserValue?.username
        );
        //  if (user?.username !== newUserValue?.username) { // Only happens on new user
        if (interval) {
          console.log('Clearing interval');
          clearInterval(interval); // stop existing interval on new login
        }
        user = newUserValue;
        console.log('Updating user to', user);
        //}
      }
    }
  }
}
chrome.storage.onChanged.addListener(handleStorageChange);

//checkIdleState();
// setInterval(checkIdleState, 1000);

function checkNextFrozen() {
  console.log('checking', user.frozenBrowsing, user.nextFrozen);
  if (user && user.nextFrozen) {
    console.log('checking again1', user.nextFrozen);
    const nextFrozenTime = new Date(user.nextFrozen).getTime();
    const currentTime = new Date().getTime();
    console.log(
      'checking again2',
      nextFrozenTime,
      currentTime,
      nextFrozenTime <= currentTime,
      currentTime - nextFrozenTime
    );
    if (user.nextFrozen && currentTime >= nextFrozenTime) {
      console.log('Current time is past nextFrozen:', user.nextFrozen);
      clearInterval(interval);
      interval = null;
      openWebsite();
      let currentDate = new Date();
      updateFrozenBrowsing({
        username: user.username,
        nextFrozen: null,
        frozenBrowsing: true,
        frozenUntil: new Date(currentDate.getTime() + 300000),
      }); //Update the nextFrozen time on firststate query because there would be no state change since you arent idle
      createTask({
        username: user.username,
        taskType: null,
        date: new Date(),
        startTime: currentTime,
        endTime: currentTime,
        duration: 20000,
        points: 10,
      })
        .then(r => console.log('Done'))
        .catch(e => console.log('Error', e)); //TODO specify task duration
    }
  }
}

async function createTask(data) {
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
  async function (details) {
    const url = new URL(details.url);

    console.log('Checking navigation:', interval === null, url);
    for (const site of user?.blacklistedWebsites) {
      if (isSignificantPartContained(site, url.href) && !interval) {
        // interval = setInterval(checkNextFrozen, user.taskFrequency);
        chrome.tabs.sendMessage(details.tabId, { type: 'WEBSITE_BLOCKED', site: site });
        console.log('Set new interval', user.taskFrequency);
        let currentDate = new Date();
        console.log('User info changed, updating frozen browsing');
        updateFrozenBrowsing({
          username: user.username,
          nextFrozen: new Date(currentDate.getTime() + user.taskFrequency),
          frozenBrowsing: false, //TODO Check here if setting automatically to false
        });
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        interval = setInterval(checkNextFrozen, 1000);
        console.log('website blocked');
      }
    }

    if (!url.href.startsWith('http://localhost:3000/') && user?.frozenBrowsing) {
      const redirectUrl = 'http://localhost:3000/break-task';
      chrome.tabs.update(details.tabId, { url: redirectUrl });
    }
  },
  { url: [{ schemes: ['http', 'https'] }] }
);

function isSignificantPartContained(str1, str2) {
  const [smaller, larger] = str1.length < str2.length ? [str1, str2] : [str2, str1];

  let i = 0,
    j = 0;

  while (i < smaller.length && j < larger.length) {
    if (smaller[i] === larger[j]) {
      i++;
    }
    j++;
  }
  const matchThreshold = 0.7;
  return i >= smaller.length * matchThreshold;
}
