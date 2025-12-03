
import axios from 'axios';
import { Note, Category, User } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jb_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  login: async (email: string, password?: string): Promise<{user: User, token: string}> => {
    const res = await api.post('/auth/login/', { email, password });
    localStorage.setItem('jb_token', res.data.token);
    return res.data;
  },
  
  register: async (email: string, password?: string): Promise<{user: User, token: string}> => {
    const res = await api.post('/auth/register/', { email, password });
    localStorage.setItem('jb_token', res.data.token);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('jb_token');
  },

  // Notes
  getNotes: async (): Promise<Note[]> => {
    const res = await api.get('/notes/');
    return res.data;
  },

  saveNote: async (note: Note): Promise<Note> => {
    // If ID is numeric (or effectively numeric string from DB), it's an update. 
    // Temp IDs from frontend usually start with "temp_"
    const isNew = typeof note.id === 'string' && note.id.startsWith('temp_');
    
    if (isNew) {
      const { id, ...data } = note; // Drop temp ID
      const res = await api.post('/notes/', data);
      return res.data;
    } else {
      const res = await api.patch(`/notes/${note.id}/`, note);
      return res.data;
    }
  },

  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}/`);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get('/categories/');
    return res.data;
  },

  saveCategory: async (category: Category): Promise<Category> => {
    const isNew = typeof category.id === 'string' && (category.id.startsWith('cat_') || category.id.startsWith('temp_'));
    if (isNew) {
      const { id, ...data } = category;
      const res = await api.post('/categories/', data);
      return res.data;
    } else {
      const res = await api.patch(`/categories/${category.id}/`, category);
      return res.data;
    }
  },
  
  updateNotesCategory: async (notes: Note[]) => {
      // In a real app, create a bulk update endpoint
      for (const n of notes) {
          await api.patch(`/notes/${n.id}/`, { categoryId: n.categoryId });
      }
  },

  deleteCategory: async (id: string) => {
    await api.delete(`/categories/${id}/`);
  }
};
