
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiService } from '../services/api';
import { User, Note, Category } from '../types';
import { Dashboard } from '../components/Dashboard'; // Note: Move Dashboard to components folder
import { NoteEditor } from '../components/NoteEditor';
import { CategoryManager } from '../components/CategoryManager';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('jb_token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const [fetchedNotes, fetchedCats] = await Promise.all([
          apiService.getNotes(),
          apiService.getCategories()
        ]);
        setNotes(fetchedNotes);
        setCategories(fetchedCats);
        setUser({ id: '1', email: 'user@example.com' }); // In real app, fetch user profile
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch data", e);
        router.push('/login');
      }
    };
    init();
  }, [router]);

  const handleLogout = () => {
    apiService.logout();
    router.push('/login');
  };

  const handleCreateNote = async () => {
    const defaultCatId = categories.length > 0 ? categories[0].id : '';
    // Use a temp ID for optimistic UI, backend will replace it
    const tempNote: Note = {
      id: `temp_${Date.now()}`,
      title: '',
      content: '',
      categoryId: defaultCatId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotes([tempNote, ...notes]);
    setEditingNote(tempNote);
    
    try {
      const saved = await apiService.saveNote(tempNote);
      // Update with real ID from backend
      setNotes(prev => prev.map(n => n.id === tempNote.id ? saved : n));
      setEditingNote(saved);
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const handleUpdateNote = async (updatedNote: Note) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
    await apiService.saveNote(updatedNote);
  };

  const handleUpdateNotesList = async (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    await apiService.updateNotesCategory(updatedNotes);
  };

  const handleUpdateCategories = async (updatedCats: Category[]) => {
    setCategories(updatedCats);
    // Ideally update individual changed categories, for now we save all (apiService handles diff in real implementation or loop)
    // For this demo we just assume the manager calls API for single changes, 
    // but if the manager returns a full list, we'd need to sync.
    // Let's assume CategoryManager calls apiService directly for actions and we just refresh or set state here.
  };

  const handleDeleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (editingNote?.id === id) setEditingNote(null);
    await apiService.deleteNote(id);
  };

  if (loading) return <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center text-[#8B7355]">Loading...</div>;

  return (
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
          onUpdateCategories={handleUpdateCategories} // This needs simple state update, API calls are inside manager usually or wrapped here
          onUpdateNotes={handleUpdateNotesList}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
}
