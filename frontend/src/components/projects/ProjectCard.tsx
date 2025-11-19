import { Project } from '../../types';
import Button from '../common/Button';

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const statusStyles: Record<Project['status'], string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-indigo-100 text-indigo-700',
  ON_HOLD: 'bg-amber-100 text-amber-700',
};

const ProjectCard = ({ project, onEdit, onDelete }: Props) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
        <p className="text-sm text-slate-500">{project.description}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[project.status]}`}>
        {project.status}
      </span>
    </div>
    <div className="flex items-center justify-between text-xs text-slate-500">
      <p>Actualizado: {new Date(project.updatedAt).toLocaleDateString()}</p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onEdit(project)}>
          Editar
        </Button>
        <Button variant="ghost" onClick={() => onDelete(project)}>
          Eliminar
        </Button>
      </div>
    </div>
  </div>
);

export default ProjectCard;
