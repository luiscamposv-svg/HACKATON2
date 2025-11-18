import { useCallback, useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TaskForm from '../components/tasks/TaskForm';
import ProjectForm from '../components/projects/ProjectForm';
import { createProject, fetchProjects } from '../services/projectService';
import { createTask, fetchTasks } from '../services/taskService';
import { Project, Task } from '../types';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { user } = useAuth();

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
    await createTask(values);
    setIsTaskModalOpen(false);
    await loadData();
  };

  const handleProjectSubmit = async (values: { name: string; description: string; status: Project['status'] }) => {
    await createProject(values);
    setIsProjectModalOpen(false);
    await loadData();
  };

  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter((task) => task.status !== 'COMPLETED').length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Bienvenido de nuevo</p>
          <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
          <p className="text-sm text-slate-500">Revisa el estado de tus proyectos y tareas.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsTaskModalOpen(true)}>Crear tarea</Button>
          <Button variant="secondary" onClick={() => setIsProjectModalOpen(true)}>
            Nuevo proyecto
          </Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Tareas totales">
          <p className="text-3xl font-bold text-slate-900">{tasks.length}</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Proyectos recientes" subtitle="Los últimos que has tocado">
          {loading ? (
            <p>Cargando proyectos...</p>
          ) : projects.length ? (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">{project.name}</p>
                  <p className="text-sm text-slate-500">{project.description}</p>
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
                <li key={task.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">{task.title}</p>
                  <p className="text-sm text-slate-500">{task.description}</p>
                  <p className="text-xs text-slate-400">Estado: {task.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Sin actividad registrada.</p>
          )}
        </Card>
      </div>

      <Modal
        title="Nueva tarea"
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <TaskForm
          onSubmit={handleTaskSubmit}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>

      <Modal
        title="Nuevo proyecto"
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      >
        <ProjectForm
          onSubmit={handleProjectSubmit}
          onCancel={() => setIsProjectModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;
