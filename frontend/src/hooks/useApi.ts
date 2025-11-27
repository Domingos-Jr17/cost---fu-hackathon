'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';

interface ApiHookState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApiCall<T>(apiFunction: () => Promise<T>, dependencies: any[] = []): ApiHookState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const executeCall = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      console.error('API call error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    executeCall();
  }, dependencies);

  return { data, loading, error, refetch: executeCall };
}

// Specific hooks for common API operations
export function useProjects(params?: { limit?: number; page?: number; search?: string; provincia?: string; setor?: string }) {
  return useApiCall(
    () => apiService.getProjects(params),
    [params?.limit, params?.page, params?.search, params?.provincia, params?.setor]
  );
}

export function useProjectById(id: string) {
  return useApiCall(
    () => apiService.getProjectById(id),
    [id]
  );
}

export function useReports(params?: { limit?: number; page?: number; projectId?: string }) {
  return useApiCall(
    () => apiService.getReports(params),
    [params?.limit, params?.page, params?.projectId]
  );
}

export function useStats() {
  return useApiCall(
    () => apiService.getStats(),
    []
  );
}

// Hook for handling API mutations (POST, PUT, DELETE)
export function useApiMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables: TVariables) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(variables);
      setData(result);
      return result;
    } catch (err) {
      console.error('API mutation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during mutation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, mutate };
}

export function useCreateReport() {
  const apiMutation = useApiMutation(
    (data: any) => apiService.createReport(data)
  );
  
  return apiMutation;
}