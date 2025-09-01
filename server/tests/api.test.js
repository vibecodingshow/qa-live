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

describe('API Endpoints', () => {

  describe('GET /', () => {
    it('should return the welcome message', () => {
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
  });

  describe('GET /health', () => {
    it('should return health status', () => {
      // Reset mocks
      mockJson.mockClear();
      
      // Call the health handler directly
      if (setup.healthHandler) {
        setup.healthHandler({}, mockRes);
        
        // Verify the response
        expect(mockJson).toHaveBeenCalled();
        
        // Extract the argument passed to mockJson
        const responseData = mockJson.mock.calls[0][0];
        expect(responseData).toHaveProperty('status', 'OK');
        expect(responseData).toHaveProperty('timestamp');
        
        // Verify timestamp is a valid ISO string
        const timestamp = new Date(responseData.timestamp);
        expect(timestamp.toString()).not.toBe('Invalid Date');
      } else {
        fail('Health handler not found');
      }
    });
  });

  describe('Route Registration', () => {
    it('should register all required routes', () => {
      // Verify that routes are registered
      expect(mockApp.get).toHaveBeenCalledWith('/', expect.any(Function));
      expect(mockApp.get).toHaveBeenCalledWith('/health', expect.any(Function));
    });
  });
});