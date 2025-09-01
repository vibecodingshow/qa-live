// Mock Express module
const mockApp = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  listen: jest.fn().mockReturnValue({
    on: jest.fn()
  })
};

const express = jest.fn(() => mockApp);
express.json = jest.fn(() => 'json-middleware');
express.urlencoded = jest.fn(() => 'urlencoded-middleware');
express.static = jest.fn(() => 'static-middleware');

module.exports = express;