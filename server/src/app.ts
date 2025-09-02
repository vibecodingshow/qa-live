import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Questions endpoint - PUT to update a question (answer or status)
app.put('/questions/:id', (req, res) => {
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
    const questionIndex = questions.findIndex(q => q.id === id);
    
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

// Questions endpoint - POST a new question
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

export default app;