import { useState, useEffect, useCallback } from 'react';
import { fetchDimensions } from '../api';
import type { Dimension } from '../types';

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDimensions = useCallback(async () => {
    try {
      const data = await fetchDimensions();
      setDimensions(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load dimensions'));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadDimensions().finally(() => setLoading(false));
  }, [loadDimensions]);

  return { dimensions, loading, error };
};