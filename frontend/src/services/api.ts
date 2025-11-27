// API service for Costant frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

interface ApiConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

class ApiService {
  async request<T>(endpoint: string, config?: ApiConfig): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const requestConfig: RequestInit = {
      method: config?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    };

    if (config?.body) {
      requestConfig.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Projects API methods
  getProjects(params?: { limit?: number; page?: number; search?: string; provincia?: string; setor?: string }) {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.provincia) queryParams.set('provincia', params.provincia);
    if (params?.setor) queryParams.set('setor', params.setor);
    
    const queryString = queryParams.toString();
    const endpoint = `/projects${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  getProjectById(id: string) {
    return this.request(`/projects/${id}`);
  }

  // Reports API methods
  getReports(params?: { limit?: number; page?: number; projectId?: string }) {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.projectId) queryParams.set('projectId', params.projectId);
    
    const queryString = queryParams.toString();
    const endpoint = `/reports${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  createReport(data: any) {
    return this.request('/reports', {
      method: 'POST',
      body: data
    });
  }

  // Stats API method
  getStats() {
    return this.request('/stats');
  }
}

export const apiService = new ApiService();