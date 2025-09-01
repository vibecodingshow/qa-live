# API Testing for Q&A Backend

This directory contains automated integration tests for the Q&A backend API endpoints.

## Test Files

- `api.test.js`: Integration tests for API endpoints
- `setup.js`: Test setup configuration
- `helpers.js`: Helper functions for testing

## Testing Approach

We use an **integration testing** approach that:
- Makes real HTTP requests to the Express app
- Tests the complete request-response cycle
- Verifies actual behavior rather than implementation details

## Running Tests

You can run the tests using the following npm commands:

```bash
# Build TypeScript files first
npm run build

# Run all tests
npm test

# Run tests in watch mode (automatically re-run when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI environment
npm run test:ci
```

## Test Coverage

The tests cover:

1. **Basic Functionality**
   - Root endpoint (`/`) returns the correct welcome message
   - Health endpoint (`/health`) returns status and timestamp

2. **HTTP Response Properties**
   - Status codes are correct (200 for valid requests, 404 for invalid routes)
   - Content types are appropriate for each endpoint
   - Response structure matches expectations

3. **Error Handling**
   - Non-existent routes return 404

## Adding New Tests

When adding new endpoints to the API, please add corresponding integration tests following the existing patterns.

For each new endpoint, test:
1. The HTTP response status code
2. The content type header
3. The response body/content
4. Edge cases and error conditions

## Example Test

```javascript
describe('GET /new-endpoint', () => {
  it('should return expected data', async () => {
    const response = await request(app)
      .get('/new-endpoint')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toHaveProperty('propertyName');
    // Add more assertions as needed
  });
});