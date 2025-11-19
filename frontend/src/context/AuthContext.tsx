import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, profileRequest, registerRequest } from '../services/authService';
import { setAuthToken } from '../services/api';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('techflow_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const persistToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('techflow_token', newToken);
      setAuthToken(newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem('techflow_token');
      setAuthToken(null);
      setToken(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const profile = await profileRequest();
      setUser(profile);
    } catch (err) {
      console.error(err);
      persistToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [persistToken]);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      refreshProfile();
    } else {
      setIsLoading(false);
    }
  }, [token, refreshProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      const response = await loginRequest(email, password);
      persistToken(response.token);
      setUser(response.user);
      navigate('/dashboard');
    },
    [navigate, persistToken]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);
      await registerRequest(name, email, password);
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate, persistToken]);

  const value = useMemo(
    () => ({ user, token, isLoading, error, login, register, logout, refreshProfile }),
    [user, token, isLoading, error, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
