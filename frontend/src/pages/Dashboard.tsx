import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TaskForm from '../components/tasks/TaskForm';
import ProjectForm from '../components/projects/ProjectForm';
import { createProject, fetchProjects } from '../services/projectService';
import { createTask, fetchTasks } from '../services/taskService';
import { Project, Task, TaskAttachment } from '../types';
import { useAuth } from '../hooks/useAuth';
import DeadlineNotifications from '../components/tasks/DeadlineNotifications';
import { useTaskMetadata } from '../hooks/useTaskMetadata';

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { user } = useAuth();
  const { getMetadata, setMetadata } = useTaskMetadata();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectResponse, taskResponse] = await Promise.all([fetchProjects({ limit: 5 }), fetchTasks({ limit: 10 })]);
      setProjects(projectResponse.data);
      setTasks(taskResponse.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTaskSubmit = async (values: Partial<Task>) => {
    const savedTask = await createTask(values);
    await loadData();
    return savedTask;
  };

  const handleProjectSubmit = async (values: { name: string; description: string; status: Project['status'] }) => {
    await createProject(values);
    setIsProjectModalOpen(false);
    await loadData();
  };

  const handleMetadataSubmit = (taskId: string, metadata: { tags: string[]; attachments: TaskAttachment[] }) => {
    const current = getMetadata(taskId);
    setMetadata(taskId, { ...current, tags: metadata.tags, attachments: metadata.attachments });
  };

  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter((task) => task.status !== 'COMPLETED').length;

  const analytics = useMemo(() => {
    const priorities = tasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.priority] = (acc[task.priority] ?? 0) + 1;
      return acc;
    }, {});
    return priorities;
  }, [tasks]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Bienvenido de nuevo</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Revisa el estado de tus proyectos y tareas.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsTaskModalOpen(true)}>Crear tarea</Button>
          <Button variant="secondary" onClick={() => setIsProjectModalOpen(true)}>
            Nuevo proyecto
          </Button>
        </div>
      </header>

      <DeadlineNotifications tasks={tasks} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Tareas totales">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
        </Card>
        <Card title="Completadas">
          <p className="text-3xl font-bold text-emerald-600">{completedTasks}</p>
        </Card>
        <Card title="Pendientes">
          <p className="text-3xl font-bold text-amber-500">{pendingTasks}</p>
        </Card>
        <Card title="Proyectos activos">
          <p className="text-3xl font-bold text-brand-600">{projects.filter((p) => p.status === 'ACTIVE').length}</p>
        </Card>
      </section>

      <Card title="Dashboard analítico" subtitle="Distribución de prioridades">
        <div className="space-y-3">
          {Object.entries(analytics).map(([priority, value]) => (
            <div key={priority}>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300">
                <span>{priority}</span>
                <span>{value} tareas</span>
              </div>
              <div className="mt-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-3 rounded-full bg-brand-500"
                  style={{ width: `${Math.min(100, (value / Math.max(1, tasks.length)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {!tasks.length && <p className="text-sm text-slate-500">Crea tareas para ver estadísticas.</p>}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Proyectos recientes" subtitle="Los últimos que has tocado">
          {loading ? (
            <p>Cargando proyectos...</p>
          ) : projects.length ? (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white">{project.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Sin proyectos disponibles.</p>
          )}
        </Card>
        <Card title="Actividad reciente" subtitle="Últimas tareas actualizadas">
          {loading ? (
            <p>Cargando actividad...</p>
          ) : tasks.length ? (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li key={task.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                  <p className="text-xs text-slate-400">Estado: {task.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Sin actividad registrada.</p>
          )}
        </Card>
      </div>

      <Modal title="Nueva tarea" isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
        <TaskForm
          onSubmit={async (values) => {
            const saved = await handleTaskSubmit(values);
            setIsTaskModalOpen(false);
            return saved;
          }}
          onMetadataSubmit={handleMetadataSubmit}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>

      <Modal title="Nuevo proyecto" isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)}>
        <ProjectForm onSubmit={handleProjectSubmit} onCancel={() => setIsProjectModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default DashboardPage;
