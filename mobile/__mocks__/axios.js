const mockAxios = jest.createMockFromModule('axios');

// Mock data storage
let mockData = {};

// Function to set mock data
mockAxios.__setMockData = data => {
  mockData = data;
};

// Mock for axios.post
mockAxios.post = jest.fn((url, postData) => {
  return Promise.resolve({ data: mockData[url] || {}, status: 200 });
});

// Add similar mocks for axios.get, axios.put, axios.delete as needed
mockAxios.get = jest.fn(url => {
  return Promise.resolve({ data: mockData[url] || {}, status: 200 });
});

mockAxios.put = jest.fn((url, postData) => {
  return Promise.resolve({ data: mockData[url] || {}, status: 200 });
});

mockAxios.delete = jest.fn(url => {
  return Promise.resolve({ data: mockData[url] || {}, status: 200 });
});

module.exports = mockAxios;
