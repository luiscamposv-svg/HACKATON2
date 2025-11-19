import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TaskAttachment, TaskComment, TaskMetadata } from '../types';

interface TaskMetadataContextValue {
  getMetadata: (taskId: string) => TaskMetadata;
  setMetadata: (taskId: string, metadata: TaskMetadata) => void;
  setTags: (taskId: string, tags: string[]) => void;
  addComment: (taskId: string, comment: TaskComment) => void;
  addAttachment: (taskId: string, attachment: TaskAttachment) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
}

const defaultMetadata: TaskMetadata = { tags: [], attachments: [], comments: [] };

const STORAGE_KEY = 'techflow_task_metadata_v1';

const TaskMetadataContext = createContext<TaskMetadataContextValue | undefined>(undefined);

const loadMetadataFromStorage = () => {
  if (typeof window === 'undefined') return {} as Record<string, TaskMetadata>;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {} as Record<string, TaskMetadata>;
  try {
    return JSON.parse(raw) as Record<string, TaskMetadata>;
  } catch (error) {
    console.warn('No se pudo parsear el metadata almacenado', error);
    return {} as Record<string, TaskMetadata>;
  }
};

export const TaskMetadataProvider = ({ children }: { children: ReactNode }) => {
  const [metadataMap, setMetadataMap] = useState<Record<string, TaskMetadata>>(loadMetadataFromStorage);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadataMap));
  }, [metadataMap]);

  const updateEntry = (taskId: string, updater: (current: TaskMetadata) => TaskMetadata) => {
    setMetadataMap((prev) => {
      const current = prev[taskId] ?? defaultMetadata;
      return { ...prev, [taskId]: updater(current) };
    });
  };

  const value = useMemo(
    () => ({
      getMetadata: (taskId: string) => metadataMap[taskId] ?? defaultMetadata,
      setMetadata: (taskId: string, metadata: TaskMetadata) => {
        setMetadataMap((prev) => ({ ...prev, [taskId]: metadata }));
      },
      setTags: (taskId: string, tags: string[]) =>
        updateEntry(taskId, (current) => ({ ...current, tags })),
      addComment: (taskId: string, comment: TaskComment) =>
        updateEntry(taskId, (current) => ({ ...current, comments: [...current.comments, comment] })),
      addAttachment: (taskId: string, attachment: TaskAttachment) =>
        updateEntry(taskId, (current) => ({ ...current, attachments: [...current.attachments, attachment] })),
      removeAttachment: (taskId: string, attachmentId: string) =>
        updateEntry(taskId, (current) => ({
          ...current,
          attachments: current.attachments.filter((item) => item.id !== attachmentId),
        })),
    }),
    [metadataMap],
  );

  return <TaskMetadataContext.Provider value={value}>{children}</TaskMetadataContext.Provider>;
};

export const useTaskMetadataContext = () => {
  const context = useContext(TaskMetadataContext);
  if (!context) throw new Error('useTaskMetadataContext must be used inside TaskMetadataProvider');
  return context;
};
