
export interface Category {
  id: string; // Django ID is int, but we keep string for TS compatibility
  name: string;
  themeId: string; 
}

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  updatedAt: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
}
