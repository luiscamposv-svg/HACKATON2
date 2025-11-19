import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Perfil de usuario</h1>
        <p className="text-sm text-slate-500">Actualiza tu información y revisa tu actividad.</p>
      </header>

      <Card title="Información principal">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Nombre</dt>
            <dd className="text-lg font-semibold text-slate-900">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Correo</dt>
            <dd className="text-lg font-semibold text-slate-900">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Miembro desde</dt>
            <dd className="text-lg font-semibold text-slate-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/D'}
            </dd>
          </div>
        </dl>
        <Button variant="secondary" className="mt-6" onClick={refreshProfile}>
          Refrescar perfil
        </Button>
      </Card>
    </div>
  );
};

export default ProfilePage;
