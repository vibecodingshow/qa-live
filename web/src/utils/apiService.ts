import { Question, Speaker } from '../types';
import { generateUserSalt, hashPassword } from './authUtils';

// Get the current token from the auth context
const getAuthToken = (): string | null => {
  // This will be set by the auth context
  return (window as any).__authToken || null;
};

// Set the auth token (called by auth context)
export const setAuthToken = (token: string | null): void => {
  (window as any).__authToken = token;
};

// Base URL for API requests - use proxy path
const API_BASE_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  return response.json();
};

// Convert API date strings to Date objects
const convertDates = (question: any): Question => {
  return {
    ...question,
    submittedAt: new Date(question.submittedAt),
    answeredAt: question.answeredAt ? new Date(question.answeredAt) : undefined
  };
};

// API functions
export const apiService = {
  // Get all questions
  getQuestions: async (): Promise<Question[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      const data = await handleResponse(response);
      return data.map(convertDates);
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // Submit a new question
  submitQuestion: async (questionData: Omit<Question, 'id' | 'submittedAt' | 'status'>): Promise<Question> => {
    try {
      // The frontend data structure now matches what the backend expects
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
      const data = await handleResponse(response);
      
      // Convert the date string to a Date object
      return {
        ...data,
        submittedAt: new Date(data.submittedAt)
      };
    } catch (error) {
      console.error('Error submitting question:', error);
      throw error;
    }
  },

  // Update a question (answer or status)
  updateQuestion: async (
    questionId: string, 
    updateData: { 
      status: 'answered' | 'unanswered', 
      answer?: string, 
      answeredBy?: string 
    }
  ): Promise<Question> => {
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });
      const data = await handleResponse(response);
      
      // Convert date strings to Date objects
      return {
        ...data,
        submittedAt: new Date(data.submittedAt),
        answeredAt: data.answeredAt ? new Date(data.answeredAt) : undefined
      };
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },
  
  // Answer a question (compatibility method for existing code)
  answerQuestion: async (questionId: string, answer: string): Promise<Question> => {
    try {
      // Get the current user (speaker) information
      const { speaker } = await import('../hooks/useAuth').then(m => m.useAuth());
      const answeredBy = speaker?.name || 'Anonymous Speaker';
      
      // Use the updateQuestion method with the correct parameters
      return apiService.updateQuestion(questionId, {
        status: 'answered',
        answer,
        answeredBy
      });
    } catch (error) {
      console.error('Error answering question:', error);
      throw error;
    }
  },

  // Submit an answer to a question
  submitAnswer: async (questionId: string, answer: string, answeredBy: string): Promise<Question> => {
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Use the PUT endpoint with the correct data structure
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ 
          status: 'answered',
          answer, 
          answeredBy 
        }),
      });
      const data = await handleResponse(response);
      return convertDates(data);
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  },

  // Authentication endpoints with client-side password hashing
  login: async (username: string, password: string): Promise<{ success: boolean; user?: Speaker; token?: string }> => {
    try {
      // Generate consistent salt for this user (matches server-side generation)
      const salt = generateUserSalt(username);
      
      // Create secure password hash on client side
      const passwordHash = hashPassword(password, salt);
      
      // Send hashed password instead of plain text
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password: passwordHash // Send hashed password instead of plain text
        }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get all speakers
  getSpeakers: async (): Promise<Speaker[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/speakers`);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Error fetching speakers:', error);
      throw error;
    }
  }
};