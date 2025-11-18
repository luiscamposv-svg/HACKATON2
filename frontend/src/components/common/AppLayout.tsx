import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/tasks', label: 'Tareas' },
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
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-600">TechFlow</h1>
          <p className="mt-2 text-sm text-slate-500">Hola, {user?.name ?? 'equipo'} 👋</p>
        </div>
        <nav className="space-y-2 text-sm font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 transition hover:bg-brand-50 ${
                  isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
        >
          Cerrar sesión
        </button>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm lg:hidden">
          <div>
            <p className="text-sm text-slate-500">Sesión activa</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Cerrar sesión
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
