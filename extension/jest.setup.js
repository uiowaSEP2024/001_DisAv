// jest.setup.js
global.chrome = {
  runtime: {
    lastError: null,
  },
  storage: {
    local: {
      data: {},
      get: jest.fn((keys, callback) => {
        // Call the callback function with an object representing your "storage"
        // Adjust this to return data as per your requirements
        const result = {};
        keys.forEach(key => {
          result[key] = global.chrome.storage.local.data[key];
        });
        callback(result);
      }),
      set: jest.fn((items, callback) => {
        // Implement this if needed for your tests
        Object.keys(items).forEach(key => {
          global.chrome.storage.local.data[key] = items[key];
        });
        if (typeof callback === 'function') {
          callback();
        }
      }),
      clear: jest.fn(callback => {
        // Implement this if needed for your tests
        global.chrome.storage.local.data = {};
        if (typeof callback === 'function') {
          callback();
        }
      }),
    },
  },
};
