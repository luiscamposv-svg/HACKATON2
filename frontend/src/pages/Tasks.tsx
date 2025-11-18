import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskDetails from '../components/tasks/TaskDetails';
import { Project, Task, TeamMember } from '../types';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/taskService';
import { fetchProjects } from '../services/projectService';
import { fetchTeamMembers } from '../services/teamService';

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

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetchTasks({
        status: filters.status ? (filters.status as Task['status']) : undefined,
        priority: filters.priority ? (filters.priority as Task['priority']) : undefined,
        projectId: filters.projectId || undefined,
        assignedTo: filters.assignedTo || undefined,
        limit: 30,
      });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
  }, [filters.status, filters.priority, filters.projectId, filters.assignedTo]);

  useEffect(() => {
    loadFiltersData();
  }, []);

  const handleSubmit = async (values: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, values);
    } else {
      await createTask(values);
    }
    setIsModalOpen(false);
    setEditingTask(null);
    await loadTasks();
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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tareas</h1>
          <p className="text-sm text-slate-500">Filtra y administra tus pendientes.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Nueva tarea</Button>
      </header>

      <Card title="Filtros avanzados">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Estado
            <select
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="TODO">Por hacer</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="COMPLETED">Completadas</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Prioridad
            <select
              className="rounded-lg border border-slate-200 px-3 py-2"
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
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Proyecto
            <select
              className="rounded-lg border border-slate-200 px-3 py-2"
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
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Miembro asignado
            <select
              className="rounded-lg border border-slate-200 px-3 py-2"
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
          <Button variant="secondary" className="self-end" onClick={loadTasks}>
            Aplicar filtros
          </Button>
        </div>
      </Card>

      {loading ? (
        <p>Cargando tareas...</p>
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
          onSubmit={handleSubmit}
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
