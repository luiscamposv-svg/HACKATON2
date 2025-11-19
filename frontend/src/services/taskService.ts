import api from './api';
import { PaginatedResponse, Task, TaskPriority, TaskStatus } from '../types';

export interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export const fetchTasks = async (filters: TaskFilters = {}) => {
  const { data } = await api.get<{ tasks: Task[]; totalPages: number; currentPage: number }>('/tasks', {
    params: filters,
  });
  return {
    data: data.tasks,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
  } satisfies PaginatedResponse<Task>;
};

export const createTask = async (payload: Partial<Task>) => {
  const { data } = await api.post<Task>('/tasks', payload);
  return data;
};

export const updateTask = async (id: string, payload: Partial<Task>) => {
  const { data } = await api.put<Task>(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id: string) => api.delete(`/tasks/${id}`);
