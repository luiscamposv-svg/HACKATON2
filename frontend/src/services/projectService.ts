import api from './api';
import { PaginatedResponse, Project, ProjectStatus } from '../types';

export interface ProjectFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export const fetchProjects = async (filters: ProjectFilters = {}) => {
  const { data } = await api.get<{ projects: Project[]; totalPages: number; currentPage: number }>('/projects', {
    params: filters,
  });
  return {
    data: data.projects,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
  } satisfies PaginatedResponse<Project>;
};

export const createProject = async (payload: Pick<Project, 'name' | 'description'> & { status?: ProjectStatus }) => {
  const { data } = await api.post<Project>('/projects', payload);
  return data;
};

export const updateProject = async (id: string, payload: Partial<Project>) => {
  const { data } = await api.put<Project>(`/projects/${id}`, payload);
  return data;
};

export const deleteProject = async (id: string) => api.delete(`/projects/${id}`);
