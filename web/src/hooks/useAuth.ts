import { useState, createContext, useContext } from 'react';
import { Speaker, AuthContextType } from '../types';
import { apiService } from '../utils/apiService';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [speaker, setSpeaker] = useState<Speaker | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await apiService.login(username, password);
      if (data.success && data.user) {
        setSpeaker(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = (): void => {
    setSpeaker(null);
  };

  return {
    speaker,
    login,
    logout,
    isAuthenticated: !!speaker,
  };
};

export { AuthContext };