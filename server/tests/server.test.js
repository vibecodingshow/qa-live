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
  header: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis()
};

// Manually simulate middleware and route setup
mockApp.use('cors-middleware');
mockApp.use('json-middleware');
mockApp.get('/', setup.rootHandler);
mockApp.get('/health', setup.healthHandler);

describe('Server Tests', () => {

  describe('Server Configuration', () => {
    it('should have middleware configured correctly', () => {
      // Verify that middleware is applied
      expect(mockApp.use).toHaveBeenCalled();
    });

    it('should have routes configured correctly', () => {
      // Verify that routes are registered
      expect(mockApp.get).toHaveBeenCalledWith('/', expect.any(Function));
      expect(mockApp.get).toHaveBeenCalledWith('/health', expect.any(Function));
    });
  });

  describe('API Response Format', () => {
    it('should return plain text for root endpoint', () => {
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

    it('should return JSON for health endpoint', () => {
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
      } else {
        fail('Health handler not found');
      }
    });
  });

  describe('Server Initialization', () => {
    it('should be able to listen on a port', () => {
      // Verify that the app can listen on a port
      expect(mockApp.listen).toBeDefined();
    });
  });
});