'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Note, Category } from '@/types';
import { notesApi, categoriesApi } from '@/lib/api';
import { IMAGES } from '@/lib/constants';
import { Sidebar } from '@/components/Sidebar';
import { NoteCard } from '@/components/NoteCard';
import { NoteEditor } from '@/components/NoteEditor';
import { CategoryManager } from '@/components/CategoryManager';
import { Button } from '@/components/Button';
import { Plus, Menu } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'All'>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const [notesData, categoriesData] = await Promise.all([
          notesApi.getAll(),
          categoriesApi.getAll()
        ]);
        setNotes(notesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleCreateNote = useCallback(async () => {
    const defaultCatId = categories.length > 0 ? categories[0].id : null;
    
    try {
      const newNote = await notesApi.create({
        title: '',
        content: '',
        category_id: defaultCatId
      });
      
      setNotes(prev => [newNote, ...prev]);
      setEditingNote(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }, [categories]);

  const handleUpdateNote = useCallback(async (updatedNote: Note) => {
    try {
      await notesApi.update(updatedNote.id, {
        title: updatedNote.title,
        content: updatedNote.content,
        category_id: updatedNote.category_id
      });
      
      setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }, []);

  const handleDeleteNote = useCallback(async (id: number) => {
    try {
      await notesApi.delete(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      setEditingNote(prev => (prev?.id === id ? null : prev));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, []);

  const handleCreateCategory = useCallback(async (data: { name: string; theme_id: string }) => {
    try {
      const newCategory = await categoriesApi.create(data);
      setCategories(prev => [...prev, newCategory]);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  }, []);

  const handleUpdateCategory = useCallback(async (id: number, data: { name?: string; theme_id?: string }) => {
    try {
      const updatedCategory = await categoriesApi.update(id, data);
      setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
    } catch (error) {
      console.error('Error updating category:', error);
    }
  }, []);

  const handleDeleteCategory = useCallback(async (id: number, action: 'delete_all' | 'move', targetId?: number) => {
    try {
      if (action === 'delete_all') {
        await categoriesApi.deleteWithNotes(id);
        setNotes(prev => prev.filter(n => n.category_id !== id));
      } else if (action === 'move' && targetId) {
        await categoriesApi.moveNotesAndDelete(id, targetId);
        setNotes(prev => prev.map(n => n.category_id === id ? { ...n, category_id: targetId } : n));
      }
      
      setCategories(prev => prev.filter(c => c.id !== id));
      
      if (activeCategoryId === id) {
        setActiveCategoryId('All');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }, [activeCategoryId]);

  const handleBulkMoveNotes = useCallback(async (noteIds: number[], targetCategoryId: number) => {
    try {
      await notesApi.bulkMove(noteIds, targetCategoryId);
      setNotes(prev => prev.map(n => 
        noteIds.includes(n.id) ? { ...n, category_id: targetCategoryId } : n
      ));
      
      // Refresh categories to update counts
      const updatedCategories = await categoriesApi.getAll();
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error moving notes:', error);
    }
  }, []);

  const filteredNotes = useMemo(() => {
    if (activeCategoryId === 'All') return notes;
    return notes.filter(n => n.category_id === activeCategoryId);
  }, [notes, activeCategoryId]);

  const activeCategoryName = activeCategoryId === 'All' 
    ? 'All Categories' 
    : categories.find(c => c.id === activeCategoryId)?.name || 'Unknown';

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center">
        <div className="animate-pulse text-[#8B7355] font-serif text-xl">Loading JB&apos;s Note Taker...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#FBF7F0] overflow-hidden">
      <Sidebar 
        notes={notes}
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        onLogout={handleLogout}
        isOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300">
        <header className="px-6 py-5 lg:px-10 flex justify-between items-center bg-[#FBF7F0] shrink-0 border-b border-[#8B7355]/5 lg:border-none">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 hover:bg-[#F3EFE6] rounded-xl transition-colors"
              >
                <Menu size={24} color="#4A3B2C" />
              </button>
              
              <div className="flex flex-col lg:hidden">
                 <h1 className="text-xl font-bold font-serif text-[#4A3B2C]">JB&apos;s Note Taker</h1>
              </div>

              <div className="hidden lg:block">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#8B7355] opacity-50">
                    {activeCategoryName}
                 </h2>
              </div>
           </div>

           <Button onClick={handleCreateNote} className="shadow-sm hover:shadow-md">
             <Plus size={18} strokeWidth={2.5} />
             <span>New Note</span>
           </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4 lg:px-10">
          {filteredNotes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center -mt-10">
               {/* Illustration */}
               <div className="w-56 h-56 flex items-center justify-center mb-8 relative">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={IMAGES.boba} alt="Empty State" className="w-full h-full object-contain opacity-90" />
               </div>
               
               <h3 className="text-2xl font-serif font-medium text-[#4A3B2C] mb-3 max-w-md leading-normal">
                 I&apos;m just here waiting for your charming notes...
               </h3>
               
               {activeCategoryId !== 'All' && (
                 <p className="text-[#8B7355] opacity-70">
                   It looks a bit empty in &quot;{activeCategoryName}&quot;.
                 </p>
               )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  category={categories.find(c => c.id === note.category_id)}
                  onClick={() => setEditingNote(note)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

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
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onBulkMoveNotes={handleBulkMoveNotes}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
