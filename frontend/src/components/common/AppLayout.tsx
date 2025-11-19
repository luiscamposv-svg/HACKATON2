import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/tasks', label: 'Tareas' },
  { to: '/team', label: 'Equipo' },
  { to: '/profile', label: 'Perfil' },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-900 dark:text-slate-100">
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 lg:flex">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-600">TechFlow</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Hola, {user?.name ?? 'equipo'} 👋</p>
        </div>
        <nav className="space-y-2 text-sm font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 transition hover:bg-brand-50 dark:hover:bg-slate-900 ${
                  isActive ? 'bg-brand-100 text-brand-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-950 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sesión activa</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <GlobalSearch />
            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-slate-50 p-4 transition dark:bg-slate-900 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
