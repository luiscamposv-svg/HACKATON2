import { FormEvent, useEffect, useState } from 'react';
import { Project, Task, TaskPriority, TaskStatus, TeamMember } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import { fetchProjects } from '../../services/projectService';
import { fetchTeamMembers } from '../../services/teamService';

interface Props {
  initialValues?: Partial<Task>;
  onSubmit: (values: Partial<Task>) => Promise<void> | void;
  onCancel: () => void;
}

const TaskForm = ({ initialValues, onSubmit, onCancel }: Props) => {
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
  }, [initialValues]);

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
      await onSubmit({
        title,
        description,
        status,
        priority,
        projectId,
        dueDate: dueDate || undefined,
        assignedTo,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
        Proyecto asociado
        <select
          className="rounded-lg border border-slate-200 px-3 py-2"
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
        <p className="text-xs font-medium text-amber-600">
          Debes crear al menos un proyecto antes de poder registrar tareas.
        </p>
      )}
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
        Miembro asignado
        <select
          className="rounded-lg border border-slate-200 px-3 py-2"
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
        <p className="text-xs font-medium text-amber-600">
          No hay miembros disponibles para asignar tareas todavía.
        </p>
      )}
      <Input label="Título" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
        Descripción
        <textarea
          className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Estado
          <select className="rounded-lg border border-slate-200 px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="TODO">Por hacer</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="COMPLETED">Completada</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Prioridad
          <select className="rounded-lg border border-slate-200 px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </label>
      </div>
      <Input label="Fecha límite" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
