import { FormEvent, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await register(name, email, password);
    } catch (err) {
      console.error(err);
      setError('No se pudo crear la cuenta. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Nombre" required value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Correo" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Contraseña" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
      </Button>
    </form>
  );
};

export default RegisterForm;
