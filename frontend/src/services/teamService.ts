import api from './api';
import { Task, TeamMember } from '../types';

export const fetchTeamMembers = async () => {
  const { data } = await api.get<{ members: TeamMember[] }>('/team/members');
  return data.members;
};

export const fetchMemberTasks = async (memberId: string) => {
  const { data } = await api.get<{ tasks: Task[] }>(`/team/members/${memberId}/tasks`);
  return data.tasks;
};
