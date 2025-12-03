
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { NoteEditor } from './pages/NoteEditor';
import { CategoryManager } from './components/CategoryManager';
import { storageService } from './services/storage';
import { User, Note, Category } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize App
  useEffect(() => {
    const init = async () => {
      const currentUser = storageService.getUser();
      if (currentUser) {
        setUser(currentUser);
        const savedNotes = await storageService.getNotes();
        const savedCats = await storageService.getCategories();
        setNotes(savedNotes);
        setCategories(savedCats);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleLogin = async (userData: User) => {
    setUser(userData);
    const savedNotes = await storageService.getNotes();
    const savedCats = await storageService.getCategories();
    setNotes(savedNotes);
    setCategories(savedCats);
  };

  const handleLogout = async () => {
    await storageService.logout();
    setUser(null);
    setNotes([]);
  };

  const handleCreateNote = async () => {
    // Default to first category if available
    const defaultCatId = categories.length > 0 ? categories[0].id : '';
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      categoryId: defaultCatId, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Optimistic update
    setNotes([newNote, ...notes]);
    setEditingNote(newNote);
    await storageService.saveNote(newNote);
  };

  const handleUpdateNote = async (updatedNote: Note) => {
    // Optimistic update
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
    await storageService.saveNote(updatedNote);
  };
  
  const handleUpdateNotesList = async (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    // In a real app we would save all or handle batch updates. 
    // For mock localstorage we just overwrite the array in memory and sync carefully.
    // For simplicity with the mock service:
    for (const note of updatedNotes) {
      await storageService.saveNote(note);
    }
    // And handle deletions implicitly or via bulk save if service supported it.
    // The current storageService is simple. To support bulk category delete operations properly we might need a `saveAllNotes`
    // but the `deleteNote` and `saveNote` are sufficient for now if used correctly.
    // Actually, CategoryManager handles note updates via this callback.
    // Let's assume storageService handles the persistence of the specific changed notes in a real app.
    // Here we can re-save the whole list key.
    localStorage.setItem('charming_notes_data', JSON.stringify(updatedNotes));
  };

  const handleUpdateCategories = async (updatedCats: Category[]) => {
    setCategories(updatedCats);
    await storageService.saveCategories(updatedCats);
  };

  const handleDeleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (editingNote?.id === id) {
      setEditingNote(null);
    }
    await storageService.deleteNote(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center">
        <div className="animate-pulse text-[#8B7355] font-serif text-xl">Loading Charming Notes...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="text-[#4A3B2C]">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={
              user ? (
                <>
                  <Dashboard 
                    notes={notes} 
                    categories={categories}
                    onLogout={handleLogout}
                    onCreateNote={handleCreateNote}
                    onEditNote={setEditingNote}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                  />
                  
                  {editingNote && (
                    <NoteEditor 
                      note={editingNote}
                      categories={categories}
                      onSave={handleUpdateNote}
                      onDelete={handleDeleteNote}
                      onClose={() => setEditingNote(null)}
                    />
                  )}

                  {isSettingsOpen && (
                    <CategoryManager 
                      categories={categories}
                      notes={notes}
                      onUpdateCategories={handleUpdateCategories}
                      onUpdateNotes={handleUpdateNotesList}
                      onClose={() => setIsSettingsOpen(false)}
                    />
                  )}
                </>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
