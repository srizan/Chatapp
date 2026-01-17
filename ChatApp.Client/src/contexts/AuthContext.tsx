import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { AuthUser } from '../types/chat.types';

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true
});

const API_URL = 'http://localhost:5296/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('chatapp_token');
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        params: { token }
      });
      setUser({ ...response.data, token });
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('chatapp_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem('chatapp_token', token);
    await verifyToken(token);
  };

  const logout = () => {
    localStorage.removeItem('chatapp_token');
    setUser(null);
  };

return (
  <AuthContext.Provider value={{ user, login, logout, isLoading }}>
    {children}
  </AuthContext.Provider>
);
}