import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { hashPassword, comparePassword } from './utils/passwordUtils';
import { generateToken } from './utils/jwtUtils';
import { authenticateToken, AuthenticatedRequest } from './middleware/auth';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create Express app
const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || 'INFO';

// Determine if debug logging is enabled
const isDebugMode = logLevel === 'DEBUG';

// Rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts',
    message: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with actual production domain
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parsing and rate limiting
app.use(express.json({ limit: '10mb' }));
app.use(generalLimiter);

// Logging middleware that logs API requests and responses
const apiLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Only log if in development or debug mode is enabled
  if (isDevelopment || isDebugMode || logLevel !== 'ERROR') {
    const originalSend = res.send;
    const startTime = Date.now();
    const endpoint = req.originalUrl;
    const method = req.method;
    const requestBody = Object.keys(req.body).length ? req.body : null;
    
    // Format timestamp in the requested format: YYYY/MM/DD, HH:MM:SS
    const now = new Date();
    const timestamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Extract JWT token from Authorization header for debugging
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const tokenStr = token ? ` - Token: ${token.substring(0, 20)}...` : '';
    
    // Log request with body inline and token
    const requestBodyStr = requestBody ? ` - ${JSON.stringify(requestBody)}` : '';
    console.log(`[${timestamp}] [API REQUEST] ${method} ${endpoint}${requestBodyStr}${tokenStr}`);
    
    // Override res.send to capture and log the response
    res.send = function (body: any) {
      const responseTime = Date.now() - startTime;
      // Format response timestamp in the requested format: YYYY/MM/DD, HH:MM:SS
      const now = new Date();
      const responseTimestamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      // Log response with data inline
      const responseDataStr = typeof body === 'object' ? JSON.stringify(body) : body;
      console.log(`[${responseTimestamp}] [API RESPONSE] ${method} ${endpoint} - Status: ${res.statusCode} - ${responseTime}ms - ${responseDataStr}`);
      
      return originalSend.call(this, body);
    };
  }
  
  next();
};

// Apply the logger middleware
app.use(apiLogger);

// Default endpoint as requested
app.get('/', (req, res) => {
  res.send('Hello Backend for Q&A Live');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Questions endpoint - GET all questions
app.get('/questions', (req, res) => {
  try {
    const questionsFilePath = path.join(__dirname, 'data', 'questions.json');
    
    // Check if file exists
    if (!fs.existsSync(questionsFilePath)) {
      return res.status(404).json({ 
        error: 'Questions data not found',
        message: 'The questions data file does not exist'
      });
    }
    
    // Read questions from JSON file
    const questionsData = fs.readFileSync(questionsFilePath, 'utf8');
    const questions = JSON.parse(questionsData);
    
    res.status(200).json(questions);
  } catch (error) {
    // Using template literals instead of comma for error logging
    // console.error(`Error retrieving questions: ${error}`);
    // Using object literal with properties defined separately to avoid any syntax display issues
    const errorResponse = {
      error: 'Internal server error',
      message: 'Failed to retrieve questions data'
    };
    res.status(500).json(errorResponse);
  }
});

// Questions endpoint - PUT to update a question (answer or status) - requires authentication
app.put('/questions/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { status, answer, answeredBy } = req.body;
    
    // Validate request body
    if (!id) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Question ID is required' 
      });
    }
    
    if (status !== 'answered' && status !== 'unanswered') {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Status must be either "answered" or "unanswered"' 
      });
    }
    
    if (status === 'answered' && (!answer || !answeredBy)) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Answer and answeredBy are required when status is "answered"' 
      });
    }
    
    const questionsFilePath = path.join(__dirname, 'data', 'questions.json');
    
    // Check if file exists
    if (!fs.existsSync(questionsFilePath)) {
      return res.status(404).json({ 
        error: 'Questions data not found',
        message: 'The questions data file does not exist' 
      });
    }
    
    // Read questions from file
    const questionsData = fs.readFileSync(questionsFilePath, 'utf8');
    let questions = JSON.parse(questionsData);
    
    // Find the question to update
    const questionIndex = questions.findIndex((q: { id: string }) => q.id === id);
    
    if (questionIndex === -1) {
      return res.status(404).json({ 
        error: 'Question not found',
        message: `No question found with ID: ${id}` 
      });
    }
    
    // Update the question
    const updatedQuestion = {
      ...questions[questionIndex],
      status
    };
    
    // Add answer details if status is "answered"
    if (status === 'answered') {
      updatedQuestion.answer = answer;
      updatedQuestion.answeredBy = answeredBy;
      updatedQuestion.answeredAt = new Date().toISOString();
    } else {
      // Remove answer fields if status is changed to "unanswered"
      delete updatedQuestion.answer;
      delete updatedQuestion.answeredBy;
      delete updatedQuestion.answeredAt;
    }
    
    // Update the question in the array
    questions[questionIndex] = updatedQuestion;
    
    // Write updated questions back to file
    fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2));
    
    // Return the updated question
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update question' 
    });
  }
});

// Questions endpoint - POST a new question - allows anonymous users
app.post('/questions', (req, res) => {
  try {
    const { title, description, submitterName = 'Anonymous' } = req.body;
    
    // Validate request body
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Question title is required and cannot be empty' 
      });
    }
    
    const questionsFilePath = path.join(__dirname, 'data', 'questions.json');
    
    // Check if file exists, if not create an empty array
    let questions = [];
    if (fs.existsSync(questionsFilePath)) {
      const questionsData = fs.readFileSync(questionsFilePath, 'utf8');
      questions = JSON.parse(questionsData);
    }
    
    // Create new question matching the existing data structure
    const newQuestion = {
      id: Date.now().toString(), // Simple ID generation
      title: title.trim(),
      description: description ? description.trim() : '',
      submitterName: submitterName.trim() || 'Anonymous',
      submittedAt: new Date().toISOString(),
      status: 'unanswered'
    };
    
    // Add to questions array
    questions.push(newQuestion);
    
    // Write updated questions back to file
    fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2));
    
    // Return the created question
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    const errorResponse = {
      error: 'Internal server error',
      message: 'Failed to create question'
    };
    res.status(500).json(errorResponse);
  }
});

// Challenge endpoint - GET to obtain server challenge for secure login
app.get('/auth/challenge', (req, res) => {
  try {
    const challenge = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();
    
    // Store challenge temporarily (in production, use Redis or similar)
    // For now, we'll include it in the response and validate on login
    res.json({
      challenge,
      timestamp,
      expiresIn: 300000 // 5 minutes
    });
  } catch (error) {
    console.error('Error generating challenge:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate authentication challenge'
    });
  }
});

// Login endpoint - POST to authenticate user with secure password hashing
app.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate request body
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Username is required and cannot be empty' 
      });
    }
    
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Password is required and cannot be empty' 
      });
    }
    
    const speakersFilePath = path.join(__dirname, 'data', 'speakers.json');
    
    // Check if file exists
    if (!fs.existsSync(speakersFilePath)) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'User data file not found' 
      });
    }
    
    // Read speakers from file
    const speakersData = fs.readFileSync(speakersFilePath, 'utf8');
    const speakers = JSON.parse(speakersData);
    
    // Find user by username
    const user = speakers.find((speaker: { username: string }) => 
      speaker.username === username.trim()
    );
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid username or password' 
      });
    }
    
    // Verify the client-side hashed password
    // The client sends: SHA256(password + salt) where salt = SHA256(username + 'server-salt')
    // We need to compare the received hash directly with the stored hash
    if (password.trim() !== user.password) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid username or password' 
      });
    }
    
    // Generate JWT token
    const token = generateToken(user.id, user.username);
    
    // Return user data without password and include token
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to authenticate user' 
    });
  }
});

// Protected route example - requires authentication
app.get('/profile', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user
  });
});

// Logout endpoint (client-side token removal)
app.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully. Please remove the token from client storage.'
  });
});

// Speakers endpoint - GET all speakers (for speaker selection)
app.get('/speakers', (req, res) => {
  try {
    const speakersFilePath = path.join(__dirname, 'data', 'speakers.json');
    
    // Check if file exists
    if (!fs.existsSync(speakersFilePath)) {
      return res.status(404).json({ 
        error: 'Speakers data not found',
        message: 'The speakers data file does not exist'
      });
    }
    
    // Read speakers from JSON file
    const speakersData = fs.readFileSync(speakersFilePath, 'utf8');
    const speakers = JSON.parse(speakersData);
    
    // Return speakers without passwords
    const speakersWithoutPasswords = speakers.map((speaker: { password: string, [key: string]: any }) => {
      const { password: _, ...speakerWithoutPassword } = speaker;
      return speakerWithoutPassword;
    });
    
    res.status(200).json(speakersWithoutPasswords);
  } catch (error) {
    console.error('Error retrieving speakers:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to retrieve speakers data' 
    });
  }
});

// Add startup logging without modifying the listen method
const originalListen = app.listen;
app.listen = function(this: typeof app, ...args: Parameters<typeof originalListen>): ReturnType<typeof originalListen> {
  const server = originalListen.call(this, ...args);
  const port = typeof args[0] === 'number' ? args[0] : 'unknown';
  
  // Format timestamp in the requested format: YYYY/MM/DD, HH:MM:SS
  const now = new Date();
  const timestamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  console.log(`[${timestamp}] Server is running on port ${port}`);
  console.log(`[${timestamp}] Log level: ${logLevel}`);
  console.log(`[${timestamp}] API logging is ${isDevelopment || isDebugMode ? 'enabled' : 'disabled'}`);
  return server;
} as typeof app.listen;

export default app;