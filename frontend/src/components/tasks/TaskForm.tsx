import { FormEvent, useEffect, useState } from 'react';
import {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
  TaskAttachment,
  TaskMetadata,
  TeamMember,
} from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import { fetchProjects } from '../../services/projectService';
import { fetchTeamMembers } from '../../services/teamService';

interface Props {
  initialValues?: Partial<Task>;
  metadata?: TaskMetadata;
  onSubmit: (values: Partial<Task>) => Promise<Task>;
  onMetadataSubmit?: (taskId: string, metadata: Omit<TaskMetadata, 'comments'>) => Promise<void> | void;
  onCancel: () => void;
}

const emptyMetadata: TaskMetadata = { tags: [], attachments: [], comments: [] };

const TaskForm = ({ initialValues, metadata = emptyMetadata, onSubmit, onMetadataSubmit, onCancel }: Props) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status ?? 'TODO');
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? 'MEDIUM');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate?.slice(0, 10) ?? '');
  const [projectId, setProjectId] = useState(initialValues?.projectId ?? '');
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedTo, setAssignedTo] = useState(initialValues?.assignedTo ?? initialValues?.assignee?.id ?? '');
  const [tags, setTags] = useState<string[]>(metadata.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<TaskAttachment[]>(metadata.attachments ?? []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const response = await fetchProjects({ limit: 50 });
        setProjects(response.data);
      } catch (error) {
        console.error('No se pudieron cargar los proyectos disponibles', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    const loadMembers = async () => {
      try {
        setIsLoadingMembers(true);
        const members = await fetchTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('No se pudieron cargar los miembros del equipo', error);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    loadProjects();
    loadMembers();
  }, []);

  useEffect(() => {
    setTitle(initialValues?.title ?? '');
    setDescription(initialValues?.description ?? '');
    setStatus(initialValues?.status ?? 'TODO');
    setPriority(initialValues?.priority ?? 'MEDIUM');
    setDueDate(initialValues?.dueDate?.slice(0, 10) ?? '');
    setProjectId(initialValues?.projectId ?? '');
    setAssignedTo(initialValues?.assignedTo ?? initialValues?.assignee?.id ?? '');
    setTags(metadata.tags ?? []);
    setAttachments(metadata.attachments ?? []);
    setTagInput('');
  }, [initialValues, metadata]);

  const isSubmitDisabled =
    isSubmitting ||
    !projectId ||
    !assignedTo ||
    (!isLoadingProjects && projects.length === 0) ||
    (!isLoadingMembers && teamMembers.length === 0);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!projectId) return;
    setIsSubmitting(true);
    try {
      const savedTask = await onSubmit({
        title,
        description,
        status,
        priority,
        projectId,
        dueDate: dueDate || undefined,
        assignedTo,
      });
      if (savedTask?.id && onMetadataSubmit) {
        await onMetadataSubmit(savedTask.id, { tags, attachments });
      }
      setTagInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const normalized = tagInput.trim();
    if (!tags.includes(normalized)) {
      setTags((prev) => [...prev, normalized]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const newAttachments = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<TaskAttachment>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: crypto.randomUUID?.() ?? `${file.name}-${Date.now()}`,
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: reader.result as string,
              });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    );
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((file) => file.id !== attachmentId));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
        Proyecto asociado
        <select
          className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          required
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={isLoadingProjects || projects.length === 0}
        >
          <option value="">{isLoadingProjects ? 'Cargando proyectos...' : 'Selecciona un proyecto'}</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      {!isLoadingProjects && projects.length === 0 && (
        <p className="text-xs font-medium text-amber-600">Debes crear al menos un proyecto antes de poder registrar tareas.</p>
      )}
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
        Miembro asignado
        <select
          className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          required
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          disabled={isLoadingMembers || teamMembers.length === 0}
        >
          <option value="">{isLoadingMembers ? 'Cargando miembros...' : 'Selecciona un responsable'}</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </label>
      {!isLoadingMembers && teamMembers.length === 0 && (
        <p className="text-xs font-medium text-amber-600">No hay miembros disponibles para asignar tareas todavía.</p>
      )}
      <Input label="Título" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
        Descripción
        <textarea
          className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Estado
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="TODO">Por hacer</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="COMPLETED">Completada</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Prioridad
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </label>
      </div>
      <Input label="Fecha límite" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <div className="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Etiquetas y adjuntos</p>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-slate-800 dark:text-brand-200"
            >
              #{tag}
              <button type="button" className="text-xs" onClick={() => removeTag(tag)}>
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addTag();
              }
            }}
            placeholder="Añade una etiqueta y presiona Enter"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <Button type="button" variant="secondary" onClick={addTag}>
            Agregar
          </Button>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Adjuntar archivos</label>
          <input
            type="file"
            multiple
            onChange={(event) => handleFiles(event.target.files)}
            className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700"
          />
          {attachments.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {attachments.map((file) => (
                <li key={file.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <span>
                    {file.name} • {(file.size / 1024).toFixed(1)}KB
                  </span>
                  <button type="button" className="text-xs text-red-500" onClick={() => removeAttachment(file.id)}>
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
