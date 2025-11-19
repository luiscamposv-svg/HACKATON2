import { useEffect, useMemo, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectList from '../components/projects/ProjectList';
import { Project } from '../types';
import { createProject, deleteProject, fetchProjects, updateProject } from '../services/projectService';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProjects = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const response = await fetchProjects({ search: searchQuery, limit: 20 });
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    return projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search]);

  const handleSubmit = async (values: { name: string; description: string; status: Project['status'] }) => {
    if (editingProject) {
      await updateProject(editingProject.id, values);
    } else {
      await createProject(values);
    }
    setIsModalOpen(false);
    setEditingProject(null);
    await loadProjects();
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`¿Eliminar ${project.name}?`)) return;
    await deleteProject(project.id);
    await loadProjects(search);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proyectos</h1>
          <p className="text-sm text-slate-500">Administra los proyectos y su estado.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Nuevo proyecto</Button>
      </header>

      <Card title="Búsqueda">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="secondary" onClick={() => loadProjects(search)}>
            Aplicar filtros
          </Button>
        </div>
      </Card>

      {loading ? <p>Cargando proyectos...</p> : <ProjectList projects={filteredProjects} onEdit={(project) => { setEditingProject(project); setIsModalOpen(true); }} onDelete={handleDelete} />}

      <Modal
        title={editingProject ? 'Editar proyecto' : 'Nuevo proyecto'}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
      >
        <ProjectForm
          initialValues={editingProject ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
