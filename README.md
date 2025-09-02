# Vibe Coding Show

A full-stack Q&A platform application with a React frontend and Node.js backend. This platform allows audience members to submit questions anonymously, and speakers can log in to answer them during presentations or events.

## Project Structure

```
.
├── server/         # Backend Node.js/Express application
│   ├── src/        # TypeScript source code
│   │   ├── app.ts  # Express application setup
│   │   └── index.ts # Main entry point
│   └── tests/      # Jest test files
│
└── web/            # Frontend React/TypeScript application
    ├── src/        # Source code
    │   ├── components/ # UI components
    │   ├── data/       # Sample data
    │   ├── hooks/      # Custom React hooks
    │   ├── pages/      # Page components
    │   ├── types/      # TypeScript definitions
    │   └── utils/      # Utility functions
    └── public/     # Static assets
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies for both frontend and backend:
```bash
npm run install-all
```

3. Start the development servers:
```bash
npm run dev
```

This will start both the frontend and backend servers concurrently.

## Available Scripts

- `npm run install-all` - Install dependencies for both frontend and backend and root project
- `npm run dev` - Start both frontend and backend in development mode
  - Frontend: http://localhost:5173
  - Backend: http://localhost:3000
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start both frontend and backend in production mode
- `npm run test` - Run tests for both frontend and backend
- `npm run test:server` - Run only backend tests
- `npm run test:web` - Run only frontend tests

## Features

### Frontend (Web)
- Modern, responsive UI built with React, TypeScript, and Tailwind CSS
- Anonymous question submission for audience members
- Secure login system for speakers to answer questions
- Real-time statistics and question filtering
- Optimized for both mobile and desktop use

### Backend (Server)
- RESTful API endpoints built with Express and TypeScript
- Health check endpoint for monitoring
- Comprehensive test coverage with Jest and Supertest

## Technologies

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite (build tool)

### Backend
- Node.js
- Express.js
- TypeScript
- Jest (testing)

## Documentation

- [Frontend Documentation](./web/README.md)
- [Backend Documentation](./server/README.md)
- [Test Documentation](./server/tests/README.md)

## License

MIT