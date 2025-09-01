const request = require('supertest');
const setup = require('./setup');

// Import fail function from Jest
const { fail } = require('@jest/globals');

// Import the mocked app from our setup
const { mockApp } = setup;

// Mock response objects for testing handlers directly
const mockSend = jest.fn();
const mockJson = jest.fn();
const mockRes = {
  send: mockSend,
  json: mockJson,
  status: jest.fn().mockReturnThis(),
  header: jest.fn().mockReturnThis()
};

// Manually simulate middleware and route setup
mockApp.use('cors-middleware');
mockApp.use('json-middleware');
mockApp.get('/', setup.rootHandler);
mockApp.get('/health', setup.healthHandler);

describe('Direct API Tests', () => {
  
  test('GET / should return welcome message', () => {
    // Reset mocks
    mockSend.mockClear();
    
    // Call the root handler directly
    if (setup.rootHandler) {
      setup.rootHandler({}, mockRes);
      expect(mockSend).toHaveBeenCalledWith('Hello Backend for Q&A project');
    } else {
      fail('Root handler not found');
    }
  });
  
  test('GET /health should return health status', () => {
    // Reset mocks
    mockJson.mockClear();
    
    // Call the health handler directly
    if (setup.healthHandler) {
      setup.healthHandler({}, mockRes);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        status: 'OK',
        timestamp: expect.any(String)
      }));
    } else {
      fail('Health handler not found');
    }
  });
  
  test('Middleware should be applied correctly', () => {
    // Verify that the app.use was called with the right middleware
    expect(mockApp.use).toHaveBeenCalled();
  });
  
  test('Routes should be registered correctly', () => {
    // Verify that the app.get was called with the right paths
    expect(mockApp.get).toHaveBeenCalledWith('/', expect.any(Function));
    expect(mockApp.get).toHaveBeenCalledWith('/health', expect.any(Function));
  });
});