import { Project } from '../../types';
import ProjectCard from './ProjectCard';

interface Props {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ProjectList = ({ projects, onEdit, onDelete }: Props) => {
  if (!projects.length) {
    return <p className="text-sm text-slate-500">Aún no hay proyectos. ¡Crea el primero!</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ProjectList;
