import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import { Task, TaskStatus } from '../../types';
import Button from '../common/Button';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onView, onStatusChange }: Props) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <header className="mb-3 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
        <p className="text-sm text-slate-500">{task.description}</p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {STATUS_LABELS[task.status]}
      </span>
    </header>
    <div className="mb-4 space-y-2 text-xs text-slate-500">
      <p>Prioridad: {PRIORITY_LABELS[task.priority]}</p>
      {(task.project?.name || task.projectId) && <p>Proyecto: {task.project?.name ?? task.projectId}</p>}
      {(task.assignee?.name || task.assignedTo) && <p>Responsable: {task.assignee?.name ?? task.assignedTo}</p>}
      {task.dueDate && <p>Vence: {new Date(task.dueDate).toLocaleDateString()}</p>}
    </div>
    <div className="flex flex-wrap gap-2 text-sm">
      <Button variant="secondary" onClick={() => onEdit(task)}>
        Editar
      </Button>
      <Button variant="ghost" onClick={() => onView(task)}>
        Ver detalles
      </Button>
      {task.status !== 'COMPLETED' && (
        <Button variant="ghost" onClick={() => onStatusChange(task, 'COMPLETED')}>
          Marcar completada
        </Button>
      )}
      <Button variant="ghost" onClick={() => onDelete(task)}>
        Eliminar
      </Button>
    </div>
  </div>
);

export default TaskCard;
