import { Task } from '../../types';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';

interface Props {
  task: Task;
}

const TaskDetails = ({ task }: Props) => (
  <div className="space-y-4 text-sm text-slate-600">
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">Estado</p>
      <p className="text-base font-semibold text-slate-900">{STATUS_LABELS[task.status]}</p>
    </div>
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">Prioridad</p>
      <p>{PRIORITY_LABELS[task.priority]}</p>
    </div>
    {(task.assignee?.name || task.assignedTo) && (
      <div>
        <p className="text-xs font-semibold uppercase text-slate-400">Asignado a</p>
        <p>{task.assignee?.name ?? task.assignedTo}</p>
      </div>
    )}
    {(task.project?.name || task.projectId) && (
      <div>
        <p className="text-xs font-semibold uppercase text-slate-400">Proyecto</p>
        <p>{task.project?.name ?? task.projectId}</p>
      </div>
    )}
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">Descripción</p>
      <p className="whitespace-pre-line text-slate-700">{task.description}</p>
    </div>
    {task.dueDate && (
      <div>
        <p className="text-xs font-semibold uppercase text-slate-400">Fecha límite</p>
        <p>{new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
    )}
  </div>
);

export default TaskDetails;
