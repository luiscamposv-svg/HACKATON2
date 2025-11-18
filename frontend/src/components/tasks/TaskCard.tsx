import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import { Task } from '../../types';
import Button from '../common/Button';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: Props) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <header className="mb-3 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
        <p className="text-sm text-slate-500">{task.description}</p>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        {STATUS_LABELS[task.status]}
      </span>
    </header>
    <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-500">
      <p>Prioridad: {PRIORITY_LABELS[task.priority]}</p>
      {task.dueDate && <p>Vence: {new Date(task.dueDate).toLocaleDateString()}</p>}
    </div>
    <div className="flex gap-2 text-sm">
      <Button variant="secondary" onClick={() => onEdit(task)}>
        Actualizar
      </Button>
      <Button variant="ghost" onClick={() => onDelete(task)}>
        Eliminar
      </Button>
    </div>
  </div>
);

export default TaskCard;
