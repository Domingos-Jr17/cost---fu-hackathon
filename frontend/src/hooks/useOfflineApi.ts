'use client';

import { useState, useEffect, useCallback } from 'react';
import { offlineCache, generateMockOfflineData, isDataStale } from '@/lib/offline-cache';
import { apiService } from '@/services/api';

// Enhanced API hooks with offline support
export function useOfflineStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if online
      const online = navigator.onLine;
      setIsOffline(!online);

      if (online) {
        try {
          // Try to fetch fresh data
          const freshData = await apiService.getStats();

          // Cache the fresh data
          offlineCache.setStats(freshData);
          setData(freshData);
          return;
        } catch (apiError) {
          console.warn('API failed, falling back to cache:', apiError);
          setIsOffline(true);
        }
      }

      // Fallback to cached data
      const cachedData = offlineCache.getStats();
      if (cachedData) {
        setData(cachedData);

        // Check if data is stale
        const lastSync = offlineCache.getLastSync('stats');
        if (lastSync && isDataStale(lastSync, 60)) { // 1 hour
          setError('Dados offline - última atualização: ' + new Date(lastSync).toLocaleString('pt-MZ'));
        }
      } else {
        // Generate mock data for demo
        const mockData = generateMockOfflineData();
        offlineCache.setStats(mockData.stats);
        setData(mockData.stats);
        setError('Usando dados de demonstração offline');
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('Erro ao carregar estatísticas');
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOffline(false);
      fetchData();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, loading, error, isOffline, refetch };
}

export function useOfflineProjects(params?: {
  limit?: number;
  page?: number;
  search?: string;
  provincia?: string;
  setor?: string
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const online = navigator.onLine;
      setIsOffline(!online);

      if (online) {
        try {
          // Try to fetch fresh data
          const freshData = await apiService.getProjects(params);

          // Cache the fresh data
          if (Array.isArray(freshData)) {
            offlineCache.setProjects(freshData);
          } else if (freshData?.data) {
            offlineCache.setProjects(freshData.data);
          }

          setData(freshData);
          return;
        } catch (apiError) {
          console.warn('API failed, falling back to cache:', apiError);
          setIsOffline(true);
        }
      }

      // Fallback to cached data
      const cachedProjects = offlineCache.getProjects();
      if (cachedProjects) {
        // Apply filters to cached data
        let filteredProjects = [...cachedProjects];

        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredProjects = filteredProjects.filter(p =>
            p.nome.toLowerCase().includes(searchLower) ||
            p.provincia.toLowerCase().includes(searchLower) ||
            p.setor.toLowerCase().includes(searchLower)
          );
        }

        if (params?.provincia) {
          filteredProjects = filteredProjects.filter(p =>
            p.provincia === params.provincia
          );
        }

        if (params?.setor) {
          filteredProjects = filteredProjects.filter(p =>
            p.setor === params.setor
          );
        }

        // Apply pagination
        if (params?.limit) {
          const offset = ((params.page || 1) - 1) * params.limit;
          filteredProjects = filteredProjects.slice(offset, offset + params.limit);
        }

        setData(filteredProjects);

        // Check if data is stale
        const lastSync = offlineCache.getLastSync('projects');
        if (lastSync && isDataStale(lastSync, 360)) { // 6 hours
          setError('Dados offline - última atualização: ' + new Date(lastSync).toLocaleString('pt-MZ'));
        }
      } else {
        // Generate mock data for demo
        const mockData = generateMockOfflineData();
        offlineCache.setProjects(mockData.projects);

        // Apply filters to mock data
        let filteredProjects = [...mockData.projects];

        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredProjects = filteredProjects.filter(p =>
            p.nome.toLowerCase().includes(searchLower) ||
            p.provincia.toLowerCase().includes(searchLower) ||
            p.setor.toLowerCase().includes(searchLower)
          );
        }

        if (params?.provincia) {
          filteredProjects = filteredProjects.filter(p =>
            p.provincia === params.provincia
          );
        }

        if (params?.setor) {
          filteredProjects = filteredProjects.filter(p =>
            p.setor === params.setor
          );
        }

        // Apply pagination
        if (params?.limit) {
          const offset = ((params.page || 1) - 1) * params.limit;
          filteredProjects = filteredProjects.slice(offset, offset + params.limit);
        }

        setData(filteredProjects);
        setError('Usando dados de demonstração offline');
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Erro ao carregar projetos');
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();

    const handleOnline = () => {
      setIsOffline(false);
      fetchData();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, loading, error, isOffline, refetch };
}

export function useOfflineReports(params?: {
  limit?: number;
  page?: number;
  projectId?: string
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const online = navigator.onLine;
      setIsOffline(!online);

      if (online) {
        try {
          const freshData = await apiService.getReports(params);

          if (Array.isArray(freshData)) {
            offlineCache.setReports(freshData);
          } else if (freshData?.data) {
            offlineCache.setReports(freshData.data);
          }

          setData(freshData);
          return;
        } catch (apiError) {
          console.warn('API failed, falling back to cache:', apiError);
          setIsOffline(true);
        }
      }

      const cachedReports = offlineCache.getReports();
      if (cachedReports) {
        let filteredReports = [...cachedReports];

        if (params?.projectId) {
          filteredReports = filteredReports.filter(r =>
            r.projectId === params.projectId
          );
        }

        if (params?.limit) {
          const offset = ((params.page || 1) - 1) * params.limit;
          filteredReports = filteredReports.slice(offset, offset + params.limit);
        }

        setData(filteredReports);

        const lastSync = offlineCache.getLastSync('reports');
        if (lastSync && isDataStale(lastSync, 30)) { // 30 minutes
          setError('Dados offline - última atualização: ' + new Date(lastSync).toLocaleString('pt-MZ'));
        }
      } else {
        const mockData = generateMockOfflineData();
        offlineCache.setReports(mockData.reports);
        setData(mockData.reports);
        setError('Usando dados de demonstração offline');
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Erro ao carregar relatos');
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();

    const handleOnline = () => {
      setIsOffline(false);
      fetchData();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, loading, error, isOffline, refetch };
}

// Hook for cache status and management
export function useOfflineStatus() {
  const [status, setStatus] = useState(offlineCache.getCacheStatus());

  useEffect(() => {
    const updateStatus = () => {
      setStatus(offlineCache.getCacheStatus());
    };

    // Update status periodically
    const interval = setInterval(updateStatus, 5000);

    // Listen for storage events
    const handleStorageChange = () => {
      updateStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  const clearAllCache = useCallback(() => {
    offlineCache.clearAllCache();
    setStatus(offlineCache.getCacheStatus());
  }, []);

  return { status, clearAllCache };
}

// Hook for background sync
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
    setIsSupported(supported);

    if (supported) {
      offlineCache.scheduleBackgroundSync();
    }
  }, []);

  return { isSupported };
}