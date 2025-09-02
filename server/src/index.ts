import app from './app';
import { createServer } from 'http';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Get port from environment variable or use default
const port = parseInt(process.env.SERVER_PORT || '3000', 10);
const execAsync = promisify(exec);

// Function to check if port is in use - simplified for container environment
async function isPortInUse(port: number): Promise<boolean> {
  try {
    // In container, we'll skip the port check to avoid permission issues
    return false;
  } catch (error) {
    console.error('Error checking port:', error);
    return false;
  }
}

// Function to kill process using a port - disabled in container
async function killProcessOnPort(port: number): Promise<boolean> {
  // Skip killing processes in container environment
  console.log(`Skipping port killing in container environment`);
  return false;
}

// Start server with port conflict resolution
async function startServer() {
  try {
    // Check if port is in use
    const portInUse = await isPortInUse(port);
    
    if (portInUse) {
      console.log(`Port ${port} is already in use. Attempting to free it...`);
      const killed = await killProcessOnPort(port);
      if (killed) {
        console.log(`Successfully freed port ${port}`);
      } else {
        console.log(`Could not free port ${port}, but will try to start server anyway`);
      }
    }
    
    // Create HTTP server for graceful shutdown
    const server = createServer(app);
    
    // Implement graceful shutdown
    const gracefulShutdown = () => {
      console.log('Received shutdown signal, closing server...');
      server.close(() => {
        console.log('Server closed gracefully');
        process.exit(0);
      });
      
      // Force close after timeout
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
    // Start server
    server.listen(port, () => {
      console.log(`Backend server running on http://localhost:${port}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();