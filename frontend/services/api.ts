
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
    // If ID is numeric (from Django), it's an update. If it's temp string or undefined, create.
    // Note: React key generation usually uses strings like 'temp_123', Django uses Integers.
    // We check if ID is numeric to decide PUT vs POST.
    const isNew = isNaN(Number(note.id)); 
    
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
    const isNew = category.id.startsWith('cat_') || isNaN(Number(category.id));
    if (isNew) {
      const { id, ...data } = category;
      const res = await api.post('/categories/', data);
      return res.data;
    } else {
      const res = await api.patch(`/categories/${category.id}/`, category);
      return res.data;
    }
  },
  
  // Bulk update support would need custom Django views, 
  // for now we iterate (not efficient but works for conversion)
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
