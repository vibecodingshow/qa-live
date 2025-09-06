export interface Question {
  id: string;
  title: string;
  description: string;
  submitterName: string;
  submittedAt: Date;
  status: 'answered' | 'unanswered';
  answer?: string;
  answeredBy?: string;
  answeredAt?: Date;
}

export interface Speaker {
  id: string;
  username: string;
  password: string;
  name: string;
}

export interface AuthContextType {
  speaker: Speaker | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}