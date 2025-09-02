import app from './app';
import { createServer } from 'http';
import { exec } from 'child_process';
import { promisify } from 'util';

const port = 3000;
const execAsync = promisify(exec);

// Function to check if port is in use
async function isPortInUse(port: number): Promise<boolean> {
  try {
    // Try to find processes using the port
    const { stdout } = await execAsync(`lsof -i:${port} -t || echo ''`);
    return stdout.trim() !== '';
  } catch (error) {
    console.error('Error checking port:', error);
    return false;
  }
}

// Function to kill process using a port
async function killProcessOnPort(port: number): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`lsof -i:${port} -t || echo ''`);
    const pid = stdout.trim();
    
    if (pid && pid !== process.pid.toString()) {
      console.log(`Killing process ${pid} using port ${port}`);
      await execAsync(`kill -9 ${pid}`);
      // Wait a moment for the port to be released
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error killing process:', error);
    return false;
  }
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