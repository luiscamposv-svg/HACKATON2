import { useState } from 'react';
import { Task } from '../../types';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import { useTaskMetadata } from '../../hooks/useTaskMetadata';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  task: Task;
}

const TaskDetails = ({ task }: Props) => {
  const { getMetadata, addComment } = useTaskMetadata();
  const metadata = getMetadata(task.id);
  const { user } = useAuth();
  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    if (!comment.trim()) return;
    addComment(task.id, {
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      author: user?.name ?? 'Anónimo',
      content: comment.trim(),
      createdAt: new Date().toISOString(),
    });
    setComment('');
  };

  return (
    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-200">
      <div>
        <p className="text-xs font-semibold uppercase text-slate-400">Estado</p>
        <p className="text-base font-semibold text-slate-900 dark:text-white">{STATUS_LABELS[task.status]}</p>
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
        <p className="whitespace-pre-line text-slate-700 dark:text-slate-200">{task.description}</p>
      </div>
      {task.dueDate && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">Fecha límite</p>
          <p>{new Date(task.dueDate).toLocaleDateString()}</p>
        </div>
      )}
      {metadata.tags.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">Etiquetas</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {metadata.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-slate-800 dark:text-brand-200">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {metadata.attachments.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">Adjuntos</p>
          <ul className="mt-2 space-y-2">
            {metadata.attachments.map((file) => (
              <li key={file.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800">
                <span>
                  {file.name} ({(file.size / 1024).toFixed(1)}KB)
                </span>
                <a href={file.dataUrl} download={file.name} className="text-brand-600">
                  Descargar
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase text-slate-400">Comentarios</p>
        <ul className="mt-2 space-y-2">
          {metadata.comments.map((item) => (
            <li key={item.id} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              <p className="font-semibold">{item.author}</p>
              <p>{item.content}</p>
              <p className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
            </li>
          ))}
          {!metadata.comments.length && <p className="text-xs text-slate-500">Sin comentarios todavía.</p>}
        </ul>
        <div className="mt-3 flex gap-2">
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Escribe un comentario"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={handleAddComment}
            className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
