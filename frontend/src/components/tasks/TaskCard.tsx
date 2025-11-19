import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import { Task, TaskMetadata, TaskStatus } from '../../types';
import Button from '../common/Button';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  metadata?: TaskMetadata;
  draggable?: boolean;
}

const TaskCard = ({ task, onEdit, onDelete, onView, onStatusChange, metadata, draggable }: Props) => (
  <div
    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-700 dark:bg-slate-900"
    draggable={draggable}
    onDragStart={(event) => event.dataTransfer.setData('text/plain', task.id)}
  >
    <header className="mb-3 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{task.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          task.status === 'COMPLETED'
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
        }`}
      >
        {STATUS_LABELS[task.status]}
      </span>
    </header>
    <div className="mb-4 space-y-2 text-xs text-slate-500 dark:text-slate-300">
      <p>Prioridad: {PRIORITY_LABELS[task.priority]}</p>
      {(task.project?.name || task.projectId) && <p>Proyecto: {task.project?.name ?? task.projectId}</p>}
      {(task.assignee?.name || task.assignedTo) && <p>Responsable: {task.assignee?.name ?? task.assignedTo}</p>}
      {task.dueDate && <p>Vence: {new Date(task.dueDate).toLocaleDateString()}</p>}
      {metadata?.tags?.length ? (
        <p className="flex flex-wrap gap-1">
          {metadata.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-slate-800 dark:text-brand-200"
            >
              #{tag}
            </span>
          ))}
        </p>
      ) : null}
      {metadata?.attachments?.length ? (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">📎 {metadata.attachments.length} adjunto(s)</p>
      ) : null}
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
