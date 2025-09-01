// Jest setup file
// This file runs before all tests

// Create mock handlers
const rootHandler = (req, res) => {
  res.send('Hello Backend for Q&A project');
};

const healthHandler = (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
};

// Mock Express app
const mockApp = {
  use: jest.fn(),
  get: jest.fn((path, handler) => {
    // Store the handler for testing
    if (path === '/') {
      module.exports.rootHandler = handler;
    } else if (path === '/health') {
      module.exports.healthHandler = handler;
    }
  }),
  post: jest.fn(),
  listen: jest.fn().mockReturnValue({
    on: jest.fn()
  })
};

// Mock Express module
jest.mock('express', () => {
  const express = jest.fn(() => mockApp);
  express.json = jest.fn(() => 'json-middleware');
  express.urlencoded = jest.fn(() => 'urlencoded-middleware');
  express.static = jest.fn(() => 'static-middleware');
  return express;
});

// Mock CORS module
jest.mock('cors', () => {
  return jest.fn(() => 'cors-middleware');
});

// Mock app.ts module
jest.mock('../src/app', () => {
  // Call the handlers to register them
  mockApp.use('cors-middleware');
  mockApp.use('json-middleware');
  mockApp.get('/', rootHandler);
  mockApp.get('/health', healthHandler);
  
  return {
    __esModule: true,
    default: mockApp
  };
}, { virtual: true });

// Export handlers for testing
module.exports = {
  rootHandler,
  healthHandler,
  mockApp
};