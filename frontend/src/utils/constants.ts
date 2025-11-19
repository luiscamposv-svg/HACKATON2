export const API_URL =
  import.meta.env.VITE_API_URL ?? '/api';

export const STATUS_LABELS = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
};

export const PRIORITY_LABELS = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};
