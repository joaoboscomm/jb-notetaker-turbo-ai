
export interface Category {
  id: string;
  name: string;
  themeId: string; // Refers to a key in THEMES
}

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  updatedAt: string; // ISO string
  createdAt: string; // ISO string
}

export interface User {
  email: string;
  id: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
