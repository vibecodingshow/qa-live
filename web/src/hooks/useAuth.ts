import { useState, createContext, useContext } from 'react';
import { Speaker, AuthContextType } from '../types';
import { sampleSpeakers } from '../data/SpeakerUsers';

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

  const login = (username: string, password: string): boolean => {
    const foundSpeaker = sampleSpeakers.find(
      s => s.username === username && s.password === password
    );
    
    if (foundSpeaker) {
      setSpeaker(foundSpeaker);
      return true;
    }
    return false;
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