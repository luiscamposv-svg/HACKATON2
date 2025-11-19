import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskDetails from '../components/tasks/TaskDetails';
import TaskBoard from '../components/tasks/TaskBoard';
import DeadlineNotifications from '../components/tasks/DeadlineNotifications';
import { Project, Task, TeamMember, TaskAttachment } from '../types';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/taskService';
import { fetchProjects } from '../services/projectService';
import { fetchTeamMembers } from '../services/teamService';
import { useTaskMetadata } from '../hooks/useTaskMetadata';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({ status: '', priority: '', projectId: '', assignedTo: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [view, setView] = useState<'board' | 'grid'>('board');
  const { getMetadata, setMetadata } = useTaskMetadata();

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchTasks({
        status: filters.status ? (filters.status as Task['status']) : undefined,
        priority: filters.priority ? (filters.priority as Task['priority']) : undefined,
        projectId: filters.projectId || undefined,
        assignedTo: filters.assignedTo || undefined,
        limit: 50,
      });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadFiltersData = async () => {
    try {
      const [projectResponse, members] = await Promise.all([fetchProjects({ limit: 50 }), fetchTeamMembers()]);
      setProjects(projectResponse.data);
      setTeamMembers(members);
    } catch (error) {
      console.error('No se pudieron cargar los filtros avanzados', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadFiltersData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadTasks();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  const handleSubmit = async (values: Partial<Task>) => {
    if (editingTask) {
      return updateTask(editingTask.id, values);
    }
    return createTask(values);
  };

  const handleDelete = async (task: Task) => {
    if (!window.confirm(`¿Eliminar la tarea ${task.title}?`)) return;
    await deleteTask(task.id);
    await loadTasks();
  };

  const handleStatusChange = async (task: Task, status: Task['status']) => {
    await updateTask(task.id, { status });
    await loadTasks();
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleMetadataSubmit = (taskId: string, metadata: { tags: string[]; attachments: TaskAttachment[] }) => {
    const current = getMetadata(taskId);
    setMetadata(taskId, { ...current, tags: metadata.tags, attachments: metadata.attachments });
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Título', 'Estado', 'Prioridad', 'Proyecto', 'Responsable', 'Fecha límite', 'Etiquetas'];
    const rows = tasks.map((task) => {
      const metadata = getMetadata(task.id);
      return [
        task.id,
        task.title,
        task.status,
        task.priority,
        task.project?.name ?? task.projectId ?? '-',
        task.assignee?.name ?? task.assignedTo ?? '-',
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-',
        metadata.tags.join('|'),
      ];
    });
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ''}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.status === 'COMPLETED').length,
    inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
  }), [tasks]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tareas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Filtra, arrastra y administra tus pendientes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setView((prev) => (prev === 'board' ? 'grid' : 'board'))}>
            {view === 'board' ? 'Ver tarjetas' : 'Ver tablero'}
          </Button>
          <Button variant="ghost" onClick={exportToCsv}>
            Exportar CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>Nueva tarea</Button>
        </div>
      </header>

      <DeadlineNotifications tasks={tasks} />

      <Card title="Analíticas rápidas" subtitle="Estado actual del sprint">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-emerald-500">Completadas</p>
            <p className="text-3xl font-bold text-emerald-500">{stats.completed}</p>
          </div>
          <div>
            <p className="text-sm text-amber-500">En progreso</p>
            <p className="text-3xl font-bold text-amber-500">{stats.inProgress}</p>
          </div>
        </div>
      </Card>

      <Card title="Filtros avanzados">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Estado
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="TODO">Por hacer</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="COMPLETED">Completadas</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Prioridad
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={filters.priority}
              onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
            >
              <option value="">Todas</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Proyecto
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={filters.projectId}
              onChange={(e) => setFilters((prev) => ({ ...prev, projectId: e.target.value }))}
            >
              <option value="">Todos</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Miembro asignado
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={filters.assignedTo}
              onChange={(e) => setFilters((prev) => ({ ...prev, assignedTo: e.target.value }))}
            >
              <option value="">Todos</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {loading ? (
        <p>Cargando tareas...</p>
      ) : view === 'board' ? (
        <TaskBoard
          tasks={tasks}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          onView={handleView}
          onStatusChange={handleStatusChange}
          getMetadata={getMetadata}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          onView={handleView}
          onStatusChange={handleStatusChange}
          getMetadata={getMetadata}
        />
      )}

      <Modal
        title={editingTask ? 'Editar tarea' : 'Nueva tarea'}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
      >
        <TaskForm
          initialValues={editingTask ?? undefined}
          metadata={editingTask ? getMetadata(editingTask.id) : undefined}
          onSubmit={async (values) => {
            const saved = await handleSubmit(values);
            await loadTasks();
            setIsModalOpen(false);
            setEditingTask(null);
            return saved;
          }}
          onMetadataSubmit={(taskId, metadata) => handleMetadataSubmit(taskId, metadata)}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
        />
      </Modal>

      <Modal title={selectedTask?.title ?? 'Detalles de tarea'} isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}>
        {selectedTask && <TaskDetails task={selectedTask} />}
      </Modal>
    </div>
  );
};

export default TasksPage;
