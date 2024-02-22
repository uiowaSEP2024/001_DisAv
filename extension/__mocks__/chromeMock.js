const mockChrome = (() => {
  let storage = {};
  return {
    local: {
      get: jest.fn((keys, callback) => {
        callback(
          keys.reduce((acc, key) => {
            acc[key] = storage[key];
            return acc;
          }, {})
        );
      }),
      set: jest.fn((items, callback) => {
        storage = { ...storage, ...items };
        if (typeof callback === 'function') {
          callback();
        }
      }),
      clear: jest.fn(callback => {
        storage = {};
        if (typeof callback === 'function') {
          if (typeof callback === 'function') {
            callback();
          }
        }
      }),
    },
    runtime: {
      lastError: null,
    },
  };
})();

global.chrome = mockChrome;
