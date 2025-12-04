import axios, { AxiosInstance } from 'axios';
import { User, Category, Note, AuthResponse, AuthTokens } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Token management
const getTokens = (): AuthTokens | null => {
  if (typeof window === 'undefined') return null;
  const tokens = localStorage.getItem('tokens');
  return tokens ? JSON.parse(tokens) : null;
};

const setTokens = (tokens: AuthTokens) => {
  localStorage.setItem('tokens', JSON.stringify(tokens));
};

const clearTokens = () => {
  localStorage.removeItem('tokens');
  localStorage.removeItem('user');
};

const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests
  client.interceptors.request.use((config) => {
    const tokens = getTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  });

  // Handle token refresh on 401
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const tokens = getTokens();
        if (tokens?.refresh) {
          try {
            const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
              refresh: tokens.refresh,
            });
            
            const newTokens = {
              access: response.data.access,
              refresh: tokens.refresh,
            };
            setTokens(newTokens);

            originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
            return client(originalRequest);
          } catch (refreshError) {
            clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

const api = createApiClient();

// Auth API
export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/', {
      email,
      password,
      password2: password,
    });
    setTokens(response.data.tokens);
    setUser(response.data.user);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/', { email, password });
    setTokens(response.data.tokens);
    setUser(response.data.user);
    return response.data;
  },

  logout: async (): Promise<void> => {
    const tokens = getTokens();
    try {
      await api.post('/auth/logout/', { refresh: tokens?.refresh });
    } catch (e) {
      // Continue with logout even if API fails
    }
    clearTokens();
  },

  getCurrentUser: getUser,
  
  isAuthenticated: (): boolean => {
    return getTokens()?.access !== undefined;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories/');
    return response.data;
  },

  create: async (data: { name: string; theme_id: string }): Promise<Category> => {
    const response = await api.post('/categories/', data);
    return response.data;
  },

  update: async (id: number, data: { name?: string; theme_id?: string }): Promise<Category> => {
    const response = await api.patch(`/categories/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}/`);
  },

  deleteWithNotes: async (id: number): Promise<void> => {
    await api.post(`/categories/${id}/delete_with_notes/`);
  },

  moveNotesAndDelete: async (id: number, targetCategoryId: number): Promise<void> => {
    await api.post(`/categories/${id}/move_notes_and_delete/`, {
      target_category_id: targetCategoryId,
    });
  },
};

// Notes API
export const notesApi = {
  getAll: async (categoryId?: number): Promise<Note[]> => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get('/notes/', { params });
    return response.data;
  },

  get: async (id: number): Promise<Note> => {
    const response = await api.get(`/notes/${id}/`);
    return response.data;
  },

  create: async (data: { title?: string; content?: string; category_id?: number | null }): Promise<Note> => {
    const response = await api.post('/notes/', data);
    return response.data;
  },

  update: async (id: number, data: { title?: string; content?: string; category_id?: number | null }): Promise<Note> => {
    const response = await api.patch(`/notes/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}/`);
  },

  bulkMove: async (noteIds: number[], targetCategoryId: number): Promise<void> => {
    await api.post('/notes/bulk_move/', {
      note_ids: noteIds,
      target_category_id: targetCategoryId,
    });
  },
};

export default api;
