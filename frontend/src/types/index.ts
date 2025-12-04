export interface User {
  id: number;
  email: string;
  username: string;
}

export interface Category {
  id: number;
  name: string;
  theme_id: string;
  notes_count: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  category_id: number | null;
  category_name?: string;
  category_theme?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Theme {
  bg: string;
  border: string;
  label: string;
}
