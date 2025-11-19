import { Task, TaskMetadata } from '../../types';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onStatusChange: (task: Task, status: Task['status']) => void;
  getMetadata: (taskId: string) => TaskMetadata;
}

const TaskList = ({ tasks, onEdit, onDelete, onView, onStatusChange, getMetadata }: Props) => {
  if (!tasks.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-300">No hay tareas para los filtros seleccionados.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onStatusChange={onStatusChange}
          metadata={getMetadata(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;
