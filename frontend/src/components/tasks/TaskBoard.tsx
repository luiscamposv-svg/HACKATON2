import { DragEvent } from 'react';
import { Task, TaskMetadata, TaskStatus } from '../../types';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  getMetadata: (taskId: string) => TaskMetadata;
}

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

const TaskBoard = ({ tasks, onEdit, onDelete, onView, onStatusChange, getMetadata }: Props) => {
  const handleDrop = (event: DragEvent<HTMLDivElement>, status: TaskStatus) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const task = tasks.find((item) => item.id === id);
    if (task && task.status !== status) {
      onStatusChange(task, status);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statuses.map((status) => (
        <div
          key={status}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, status)}
          className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70"
        >
          <p className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {status === 'TODO' && 'Por hacer'}
            {status === 'IN_PROGRESS' && 'En progreso'}
            {status === 'COMPLETED' && 'Completadas'}
          </p>
          <div className="space-y-3">
            {tasks.filter((task) => task.status === status).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                onStatusChange={onStatusChange}
                draggable
                metadata={getMetadata(task.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
