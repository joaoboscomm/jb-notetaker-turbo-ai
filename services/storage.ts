
import { Note, User, Category } from '../types';

const NOTES_KEY = 'charming_notes_data';
const CATEGORIES_KEY = 'charming_notes_categories';
const CURRENT_USER_KEY = 'charming_notes_current_user';
const USERS_DB_KEY = 'charming_notes_users_db';

const initializeStorage = () => {
  // Init Categories
  const existingCats = localStorage.getItem(CATEGORIES_KEY);
  let cats: Category[] = [];
  
  if (!existingCats) {
    cats = [
      { id: 'cat_1', name: 'Random Thoughts', themeId: 'orange' },
      { id: 'cat_2', name: 'School', themeId: 'yellow' },
      { id: 'cat_3', name: 'Personal', themeId: 'teal' },
    ];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  } else {
    cats = JSON.parse(existingCats);
  }

  // Init Notes
  const existingNotes = localStorage.getItem(NOTES_KEY);
  if (!existingNotes) {
    const initialNotes: Note[] = [
      {
        id: '1',
        title: 'Grocery List',
        content: 'Milk\nEggs\nBread\nBananas\nSpinach',
        categoryId: cats[0].id,
        createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
      },
      {
        id: '2',
        title: 'Meeting with Team',
        content: 'Discuss project timeline and milestones.\nReview budget and resource allocation.\nAddress any blockers and plan next steps.',
        categoryId: cats[1].id,
        createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      },
      {
        id: '3',
        title: 'Vacation Ideas',
        content: 'Visit Bali for beaches and culture.\nExplore the historic sites in Rome.\nGo hiking in the Swiss Alps.\nRelax in the hot springs of Iceland.',
        categoryId: cats[0].id,
        createdAt: new Date('2024-07-15').toISOString(),
        updatedAt: new Date('2024-07-15').toISOString(),
      }
    ];
    localStorage.setItem(NOTES_KEY, JSON.stringify(initialNotes));
  }
};

initializeStorage();

export const storageService = {
  getNotes: async (): Promise<Note[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(NOTES_KEY);
        resolve(data ? JSON.parse(data) : []);
      }, 200);
    });
  },

  saveNote: async (note: Note): Promise<Note> => {
    return new Promise((resolve) => {
      const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
      const index = notes.findIndex((n: Note) => n.id === note.id);
      
      if (index >= 0) {
        notes[index] = note;
      } else {
        notes.unshift(note);
      }
      
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      resolve(note);
    });
  },

  deleteNote: async (id: string): Promise<void> => {
     return new Promise((resolve) => {
      const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
      const filtered = notes.filter((n: Note) => n.id !== id);
      localStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
      resolve();
    });
  },

  getCategories: async (): Promise<Category[]> => {
    return new Promise((resolve) => {
      const data = localStorage.getItem(CATEGORIES_KEY);
      resolve(data ? JSON.parse(data) : []);
    });
  },

  saveCategories: async (categories: Category[]): Promise<Category[]> => {
     return new Promise((resolve) => {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      resolve(categories);
     });
  },

  getUser: (): User | null => {
    const u = localStorage.getItem(CURRENT_USER_KEY);
    return u ? JSON.parse(u) : null;
  },

  login: async (email: string, password?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usersJSON = localStorage.getItem(USERS_DB_KEY) || '[]';
        const users: User[] = JSON.parse(usersJSON);
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  },

  register: async (email: string, password?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usersJSON = localStorage.getItem(USERS_DB_KEY) || '[]';
        const users: User[] = JSON.parse(usersJSON);

        if (users.some(u => u.email === email)) {
          reject(new Error('User already exists'));
          return;
        }

        const newUser: User = { 
          id: `user_${Date.now()}`, 
          email,
          password 
        };
        
        users.push(newUser);
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        
        resolve(newUser);
      }, 500);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem(CURRENT_USER_KEY);
      resolve();
    });
  }
};
