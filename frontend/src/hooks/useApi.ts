import { useCallback, useState } from 'react';

type ApiFn<T> = () => Promise<T>;

export const useApi = <T,>(fn: ApiFn<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fn();
      setData(response);
      return response;
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al consultar la API');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { data, loading, error, execute };
};
