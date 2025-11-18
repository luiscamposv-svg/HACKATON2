import { Task } from '../../types';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskList = ({ tasks, onEdit, onDelete }: Props) => {
  if (!tasks.length) {
    return <p className="text-sm text-slate-500">No hay tareas para los filtros seleccionados.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;
