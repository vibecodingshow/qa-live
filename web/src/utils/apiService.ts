import { Question, Speaker } from '../types';

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
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
      // Use the PUT endpoint with the correct data structure
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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

  // Authentication endpoints
  login: async (username: string, password: string): Promise<{ success: boolean; user?: Speaker }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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