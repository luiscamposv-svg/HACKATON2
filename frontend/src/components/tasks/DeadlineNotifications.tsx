import { useEffect, useMemo, useState } from 'react';
import { Task } from '../../types';

interface Props {
  tasks: Task[];
}

const DeadlineNotifications = ({ tasks }: Props) => {
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof window === 'undefined' || typeof Notification === 'undefined' ? 'default' : Notification.permission,
  );

  const dueSoon = useMemo(() => {
    const now = new Date().getTime();
    const horizon = now + 1000 * 60 * 60 * 24 * 2;
    return tasks
      .filter((task) => task.dueDate)
      .filter((task) => {
        const due = new Date(task.dueDate!).getTime();
        return due >= now && due <= horizon && task.status !== 'COMPLETED';
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);
  }, [tasks]);

  useEffect(() => {
    if (permission !== 'granted' || typeof Notification === 'undefined') return;
    dueSoon.forEach((task) => {
      const message = `La tarea "${task.title}" vence el ${new Date(task.dueDate!).toLocaleDateString()}`;
      new Notification('Recordatorio de fecha límite', { body: message });
    });
  }, [dueSoon, permission]);

  const requestPermission = async () => {
    if (permission === 'granted' || typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  if (!dueSoon.length) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Tareas con fecha próxima</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {dueSoon.map((task) => (
              <li key={task.id}>
                {task.title} · vence el {new Date(task.dueDate!).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
        {permission !== 'granted' && typeof Notification !== 'undefined' && (
          <button
            onClick={requestPermission}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-amber-700 shadow-sm"
          >
            Activar notificaciones
          </button>
        )}
      </div>
    </div>
  );
};

export default DeadlineNotifications;
