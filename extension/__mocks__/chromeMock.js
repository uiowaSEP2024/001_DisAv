const mockChrome = (() => {
  let storage = {};
  return {
    storage: {
      local: {
        get: jest.fn((keys, callback) => {
          const result = keys.reduce((acc, key) => {
            acc[key] = storage[key] || null;
            return acc;
          }, {});
          callback(result);
        }),
        set: jest.fn((items, callback) => {
          Object.assign(storage, items);
          if (typeof callback === 'function') {
            callback();
          }
        }),
        clear: jest.fn((callback) => {
          storage = {};
          if (typeof callback === 'function') {
            callback();
          }
        }),
      },
    },
    runtime: {
      lastError: null,
    },
  };
})();

global.chrome = mockChrome;
