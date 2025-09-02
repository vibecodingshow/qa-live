const request = require('supertest');
// Use the compiled JavaScript version
const app = require('../dist/app').default;
const fs = require('fs');
const path = require('path');

describe('API Integration Tests', () => {
  // Mock data and functions for the questions endpoint test
  const mockQuestionsData = [
    {
      id: "1",
      title: "Test Question 1",
      description: "Description for test question 1",
      submitterName: "Test User",
      submittedAt: "2024-01-15T10:30:00.000Z",
      status: "unanswered"
    },
    {
      id: "2",
      title: "Test Question 2",
      description: "Description for test question 2",
      submitterName: "Another User",
      submittedAt: "2024-01-15T11:30:00.000Z",
      status: "answered",
      answer: "This is a test answer",
      answeredBy: "Test Answerer",
      answeredAt: "2024-01-15T12:30:00.000Z"
    }
  ];
  
  // Save original fs methods before mocking
  const originalExistsSync = fs.existsSync;
  const originalReadFileSync = fs.readFileSync;
  const originalWriteFileSync = fs.writeFileSync;

  describe('GET /', () => {
    it('should return the welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /text/)
        .expect(200);
      
      expect(response.text).toBe('Hello Backend for Q&A Live');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      
      // Verify timestamp is a valid ISO string
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('Non-existent routes', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/non-existent-route')
        .expect(404);
    });
  });

  describe('GET /questions', () => {
    beforeEach(() => {
      // Mock fs.existsSync to return true
      fs.existsSync = jest.fn().mockReturnValue(true);
      
      // Mock fs.readFileSync to return our test data
      fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockQuestionsData));
    });

    afterEach(() => {
      // Restore the original implementations
      fs.existsSync = originalExistsSync;
      fs.readFileSync = originalReadFileSync;
      fs.writeFileSync = originalWriteFileSync;
    });

    it('should return all questions', async () => {
      const response = await request(app)
        .get('/questions')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('submitterName');
      expect(response.body[0]).toHaveProperty('submittedAt');
      expect(response.body[0]).toHaveProperty('status');
    });

    it('should handle file not found error', async () => {
      // Override the mock for this specific test
      fs.existsSync = jest.fn().mockReturnValue(false);
      
      const response = await request(app)
        .get('/questions')
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toEqual('Questions data not found');
    });

    it('should handle server errors', async () => {
      // Mock fs.readFileSync to throw an error
      fs.readFileSync = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const response = await request(app)
        .get('/questions')
        .expect('Content-Type', /json/)
        .expect(500);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toEqual('Internal server error');
    });
    
  });

  describe('POST /questions', () => {
    beforeEach(() => {
      // Mock fs methods
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockQuestionsData));
      fs.writeFileSync = jest.fn();
    });

    afterEach(() => {
      // Restore original fs methods
      fs.existsSync = originalExistsSync;
      fs.readFileSync = originalReadFileSync;
      fs.writeFileSync = originalWriteFileSync;
    });

    it('should create a new question and return 201 status', async () => {
      const newQuestion = {
        title: 'How do I implement a REST API?',
        description: 'I need help with setting up routes',
        submitterName: 'Developer'
      };

      const response = await request(app)
        .post('/questions')
        .send(newQuestion)
        .expect('Content-Type', /json/)
        .expect(201);
      
      // Verify response structure
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', newQuestion.title);
      expect(response.body).toHaveProperty('description', newQuestion.description);
      expect(response.body).toHaveProperty('submitterName', newQuestion.submitterName);
      expect(response.body).toHaveProperty('submittedAt');
      expect(response.body).toHaveProperty('status', 'unanswered');
      
      // Verify fs.writeFileSync was called
      expect(fs.writeFileSync).toHaveBeenCalled();
      
      // Extract the arguments passed to writeFileSync
      const writeArgs = fs.writeFileSync.mock.calls[0];
      expect(writeArgs[0]).toContain('questions.json');
      
      // Parse the JSON that was written to verify it contains our new question
      const writtenData = JSON.parse(writeArgs[1]);
      expect(Array.isArray(writtenData)).toBeTruthy();
      
      // Find our newly added question
      const addedQuestion = writtenData.find(q => q.title === newQuestion.title);
      expect(addedQuestion).toBeTruthy();
      expect(addedQuestion.submitterName).toBe(newQuestion.submitterName);
    });

    it('should return 400 if question title is missing', async () => {
      const response = await request(app)
        .post('/questions')
        .send({ submitterName: 'Developer', description: 'Some description' })
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should use "Anonymous" as default submitterName if not provided', async () => {
      const response = await request(app)
        .post('/questions')
        .send({ title: 'What is Node.js?', description: 'Please explain' })
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body).toHaveProperty('submitterName', 'Anonymous');
    });

    it('should handle server errors during question creation', async () => {
      // Mock writeFileSync to throw an error
      fs.writeFileSync = jest.fn().mockImplementation(() => {
        throw new Error('Test write error');
      });
      
      const response = await request(app)
        .post('/questions')
        .send({ title: 'Test question', description: 'Test description' })
        .expect('Content-Type', /json/)
        .expect(500);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });
  });
});