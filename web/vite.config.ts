import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { exec } from 'child_process';
import { promisify } from 'util';

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

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Load env file based on mode from the web directory
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get port from env or use default
  const port = parseInt(env.FRONTEND_PORT || '5173', 10);
  
  // Get backend URL for proxy
  const backendUrl = env.BACKEND_URL || 'http://localhost:3000';
  
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
  
  // Setup graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down Vite dev server');
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down Vite dev server');
    process.exit(0);
  });
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      host: true,
      port,
      strictPort: true, // Fail if port is already in use (after our attempt to free it)
      proxy: {
        // Configure proxy for API requests
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    // Make env variables available in the client
    define: {
      'import.meta.env.BACKEND_URL': JSON.stringify(backendUrl),
      'import.meta.env.FRONTEND_PORT': JSON.stringify(port),
    }
  };
});
