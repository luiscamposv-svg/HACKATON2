import { useEffect, useMemo, useState } from 'react';
import { fetchProjects } from '../../services/projectService';
import { fetchTasks } from '../../services/taskService';
import { Project, Task } from '../../types';

const useDebounce = (value: string, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProjects([]);
      setTasks([]);
      setIsOpen(false);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        const [projectResponse, taskResponse] = await Promise.all([
          fetchProjects({ limit: 5, search: debouncedQuery }),
          fetchTasks({ limit: 50 }),
        ]);
        const normalizedQuery = debouncedQuery.toLowerCase();
        setProjects(projectResponse.data);
        setTasks(taskResponse.data.filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(normalizedQuery)).slice(0, 8));
        setIsOpen(true);
      } catch (error) {
        console.error('Error al buscar', error);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  const hasResults = useMemo(() => projects.length > 0 || tasks.length > 0, [projects, tasks]);

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="search"
        placeholder="Búsqueda global..."
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-inner focus:border-brand-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => query && setIsOpen(true)}
      />
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {loading ? (
            <p className="text-sm text-slate-500">Buscando...</p>
          ) : hasResults ? (
            <div className="space-y-4">
              {projects.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Proyectos</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-100">
                    {projects.map((project) => (
                      <li key={project.id} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                        <p className="font-semibold">{project.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{project.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Tareas</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-100">
                    {tasks.map((task) => (
                      <li key={task.id} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                        <p className="font-semibold">{task.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Sin resultados para "{debouncedQuery}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
