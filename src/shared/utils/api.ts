import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from '../types/api.types';

// Create axios instance with default configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5154/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add firm ID to headers if available
      const firmId = localStorage.getItem('currentFirmId');
      if (firmId) {
        config.headers['X-Firm-Id'] = firmId;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentFirmId');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createApiInstance();

// Generic API request function
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.request<T | ApiResponse<T>>(config);
    
    // Handle both wrapped and direct responses
    // If the response is already wrapped in ApiResponse format, return it
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      return response.data as ApiResponse<T>;
    }
    
    // Otherwise, wrap the direct response
    return {
      success: true,
      data: response.data as T,
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ApiError } };
      if (axiosError.response?.data) {
        throw axiosError.response.data;
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw {
      success: false,
      message: errorMessage,
    } as ApiError;
  }
};

// HTTP method helpers
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiRequest<T>({ ...config, method: 'GET', url }),

  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiRequest<T>({ ...config, method: 'POST', url, data }),

  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiRequest<T>({ ...config, method: 'PUT', url, data }),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiRequest<T>({ ...config, method: 'PATCH', url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiRequest<T>({ ...config, method: 'DELETE', url }),
};

// Query parameter builder
export const buildQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
};

// File upload helper
export const uploadFile = async (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<{ url: string }>({
    method: 'POST',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });
};

// Shared import/export utilities
export const createImportFunction = (baseUrl: string) => {
  return async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ imported: number; errors: string[] }>> => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<{ imported: number; errors: string[] }>(
      `${baseUrl}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      }
    );
  };
};

export const createExportFunction = (baseUrl: string) => {
  return async (filters?: Record<string, unknown>): Promise<ApiResponse<{ downloadUrl: string }>> => {
    const params = filters || {};
    const queryString = buildQueryParams(params);
    const url = queryString 
      ? `${baseUrl}/export?${queryString}`
      : `${baseUrl}/export`;
    return api.get<{ downloadUrl: string }>(url);
  };
}; 