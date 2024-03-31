// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
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
        clear: jest.fn(callback => {
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
