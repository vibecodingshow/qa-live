# Q&A Live Backend Server

This is the backend server for the Q&A Live project. It provides API endpoints for the frontend application.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot-reload
npm run dev
```

The server will be running at http://localhost:3000

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Root Endpoint

- **URL**: `/`
- **Method**: `GET`
- **Response**: `Hello Backend for Q&A project`

### Health Check

- **URL**: `/health`
- **Method**: `GET`
- **Response**: JSON object with status and timestamp
  ```json
  {
    "status": "OK",
    "timestamp": "2025-09-01T02:00:00.000Z"
  }
  ```

## Testing

The project includes comprehensive tests for all API endpoints. See the [tests/README.md](tests/README.md) for more details.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Project Structure

```
server/
├── dist/             # Compiled JavaScript files
├── node_modules/     # Dependencies
├── src/              # Source code
│   └── index.ts      # Main application entry point
├── tests/            # Test files
│   ├── api.test.js   # API endpoint tests
│   ├── server.test.js # Server configuration tests
│   └── helpers.js    # Test helpers
├── .gitignore        # Git ignore file
├── jest.config.js    # Jest configuration
├── package.json      # Project metadata and dependencies
└── tsconfig.json     # TypeScript configuration
```

## Technologies

- Express.js - Web framework
- TypeScript - Type-safe JavaScript
- Jest - Testing framework
- Supertest - HTTP testing library
- ts-node-dev - TypeScript execution with hot-reload