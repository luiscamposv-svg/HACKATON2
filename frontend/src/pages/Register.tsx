import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Crea tu cuenta</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Únete a TechFlow</h1>
        <p className="text-sm text-slate-500">Colabora con tu equipo en tiempo real.</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-brand-600">
          Inicia sesión
        </Link>
      </p>
    </div>
  </div>
);

export default RegisterPage;
