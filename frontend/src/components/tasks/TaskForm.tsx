import { FormEvent, useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';

interface Props {
  initialValues?: Partial<Task>;
  onSubmit: (values: Partial<Task>) => Promise<void> | void;
  onCancel: () => void;
}

const TaskForm = ({ initialValues, onSubmit, onCancel }: Props) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status ?? 'TODO');
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? 'MEDIUM');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate?.slice(0, 10) ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ title, description, status, priority, dueDate });
    setIsSubmitting(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Título" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
        Descripción
        <textarea
          className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Estado
          <select className="rounded-lg border border-slate-200 px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="TODO">Por hacer</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="COMPLETED">Completada</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Prioridad
          <select className="rounded-lg border border-slate-200 px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </label>
      </div>
      <Input label="Fecha límite" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
