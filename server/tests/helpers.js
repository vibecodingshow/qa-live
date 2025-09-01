const express = require('express');
const cors = require('cors');

/**
 * Creates a test Express application that mimics the production server
 * @returns Express application configured like the production server
 */
function createTestApp() {
  const app = express();
  
  // Apply middleware
  app.use(cors());
  app.use(express.json());

  // Default endpoint
  app.get('/', (req, res) => {
    res.send('Hello Backend for Q&A project');
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  return app;
}

/**
 * Mock response object for unit testing
 */
class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.body = null;
    this.headers = {};
  }
  
  status(code) {
    this.statusCode = code;
    return this;
  }
  
  json(data) {
    this.body = data;
    this.headers['Content-Type'] = 'application/json';
    return this;
  }
  
  send(data) {
    this.body = data;
    return this;
  }
  
  setHeader(name, value) {
    this.headers[name] = value;
    return this;
  }
}

/**
 * Mock request object for unit testing
 */
function createMockRequest(options) {
  return {
    method: options.method || 'GET',
    url: options.url || '/',
    params: options.params || {},
    query: options.query || {},
    body: options.body || {},
    headers: options.headers || {},
  };
}

module.exports = {
  createTestApp,
  MockResponse,
  createMockRequest
};