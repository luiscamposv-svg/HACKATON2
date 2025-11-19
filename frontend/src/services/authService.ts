import api from './api';
import { AuthResponse, User } from '../types';

export const loginRequest = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
};

export const registerRequest = async (name: string, email: string, password: string) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};

export const profileRequest = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/profile');
  return data;
};
