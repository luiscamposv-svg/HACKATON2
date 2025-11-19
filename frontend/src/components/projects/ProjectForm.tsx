import { FormEvent, useState } from 'react';
import { Project, ProjectStatus } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';

interface Props {
  initialValues?: Partial<Project>;
  onSubmit: (values: { name: string; description: string; status: ProjectStatus }) => Promise<void> | void;
  onCancel: () => void;
}

const ProjectForm = ({ initialValues, onSubmit, onCancel }: Props) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [status, setStatus] = useState<ProjectStatus>(initialValues?.status ?? 'ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ name, description, status });
    setIsSubmitting(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Nombre del proyecto" required value={name} onChange={(e) => setName(e.target.value)} />
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
        Descripción
        <textarea
          className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
        Estado
        <select
          className="rounded-lg border border-slate-200 px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
        >
          <option value="ACTIVE">Activo</option>
          <option value="COMPLETED">Completado</option>
          <option value="ON_HOLD">En pausa</option>
        </select>
      </label>
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

export default ProjectForm;
