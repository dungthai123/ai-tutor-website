import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '../../types';

export class BaseApiService {
  protected api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'think_ai_lab',
        'location': 'vi',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  protected async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: unknown,
    config?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.request({
        method,
        url,
        data,
        ...config,
      });
      
      // Check if the response has the expected API structure
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        // This is a structured API response with success, data, etc.
        const apiResponse = response.data as { success: boolean; data?: T; message?: string; error?: string };
        
        if (apiResponse.success) {
          return {
            success: true,
            data: apiResponse.data,
          };
        } else {
          return {
            success: false,
            error: apiResponse.message || apiResponse.error || 'API request failed',
          };
        }
      } else {
        // Direct data response
        return {
          success: true,
          data: response.data,
        };
      }
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  protected async requestBlob(
    method: 'GET' | 'POST',
    url: string,
    data?: unknown
  ): Promise<Blob> {
    const response = await this.api.request({
      method,
      url,
      data,
      responseType: 'blob',
    });
    return response.data;
  }

  private getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message || 'Network error occurred';
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  }
} 