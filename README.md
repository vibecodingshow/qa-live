# Q&A Live Application

A real-time Q&A application with a React frontend and Express backend.

## Docker Setup

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

1. Build and start the containers:

```bash
docker-compose up -d
```

2. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

### Environment Configuration

#### Server Environment Variables

Create or modify `server/.env` file:

```
# Server configuration
SERVER_PORT=3000

# Logging configuration
# Available levels: ERROR, WARN, INFO, DEBUG
LOG_LEVEL=INFO
```

#### Web Environment Variables

For development, create or modify `web/.env` file:

```
# Backend configuration
BACKEND_URL=http://localhost:3000

# Frontend configuration
FRONTEND_PORT=5173
```

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

### Building for Production

To build the application for production:

```bash
# Build server
cd server && npm run build

# Build web
cd web && npm run build
```

## Project Structure

- `server/`: Backend Express application
  - `src/`: Source code
    - `data/`: Data storage (mapped as volume in Docker)
- `web/`: Frontend React application
  - `src/`: Source code
    - `components/`: React components
    - `utils/`: Utility functions including API service