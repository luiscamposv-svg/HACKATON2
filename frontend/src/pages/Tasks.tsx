import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { Task } from '../types';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/taskService';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetchTasks({
        status: filters.status ? (filters.status as Task['status']) : undefined,
        priority: filters.priority ? (filters.priority as Task['priority']) : undefined,
        limit: 30,
      });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters.status, filters.priority]);

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
        <div className="grid gap-4 sm:grid-cols-3">
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
          <Button variant="secondary" className="self-end" onClick={loadTasks}>
            Aplicar filtros
          </Button>
        </div>
      </Card>

      {loading ? <p>Cargando tareas...</p> : <TaskList tasks={tasks} onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }} onDelete={handleDelete} />}

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
    </div>
  );
};

export default TasksPage;
