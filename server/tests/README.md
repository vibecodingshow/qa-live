# API Testing for Q&A Backend

This directory contains automated tests for the Q&A backend API endpoints.

## Test Files

- `api.test.ts`: Basic API endpoint tests
- `server.test.ts`: Advanced server configuration and performance tests
- `helpers.ts`: Helper functions and mock objects for testing

## Running Tests

You can run the tests using the following npm commands:

```bash
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

2. **Server Configuration**
   - CORS is properly enabled
   - JSON parsing middleware works correctly

3. **API Response Format**
   - Content types are correct for each endpoint
   - Response structure matches expectations

4. **Error Handling**
   - Non-existent routes return 404
   - Method not allowed returns appropriate error

5. **Performance**
   - API endpoints respond within acceptable time limits

## Adding New Tests

When adding new endpoints to the API, please add corresponding tests following the existing patterns.

For each new endpoint, test:
1. The response status code
2. The response body/content
3. Edge cases and error conditions