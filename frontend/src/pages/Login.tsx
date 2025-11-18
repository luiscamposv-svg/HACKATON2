import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Bienvenido a TechFlow</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Inicia sesión para continuar</h1>
        <p className="text-sm text-slate-500">Gestiona proyectos, tareas y equipos desde un solo lugar.</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-semibold text-brand-600">
          Regístrate
        </Link>
      </p>
    </div>
  </div>
);

export default LoginPage;
