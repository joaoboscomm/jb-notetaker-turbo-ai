
import React, { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { NoteCard } from './NoteCard';
import { Note, Category } from '../types';
import { Button } from './Button';
import { Plus, Menu } from 'lucide-react';
import { IMAGES } from '../constants';

interface DashboardProps {
  notes: Note[];
  categories: Category[];
  onLogout: () => void;
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  notes, categories, onLogout, onCreateNote, onEditNote, onOpenSettings
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | 'All'>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    if (activeCategoryId === 'All') return notes;
    return notes.filter(n => String(n.categoryId) === String(activeCategoryId));
  }, [notes, activeCategoryId]);

  const activeCategoryName = activeCategoryId === 'All' 
    ? 'All Categories' 
    : categories.find(c => String(c.id) === String(activeCategoryId))?.name || 'Unknown';

  return (
    <div className="flex h-screen bg-[#FBF7F0] overflow-hidden">
      <Sidebar 
        notes={notes}
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        onLogout={onLogout}
        isOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenSettings={onOpenSettings}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300">
        <header className="px-6 py-5 lg:px-10 flex justify-between items-center bg-[#FBF7F0] shrink-0">
           <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2">
                <Menu size={24} color="#4A3B2C" />
              </button>
              <h2 className="hidden lg:block text-sm font-bold uppercase tracking-widest text-[#8B7355] opacity-50">
                {activeCategoryName}
              </h2>
           </div>
           <Button onClick={onCreateNote} className="shadow-sm hover:shadow-md">
             <Plus size={18} strokeWidth={2.5} /> <span>New Note</span>
           </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4 lg:px-10">
          {filteredNotes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center -mt-10">
               <div className="w-56 h-56 flex items-center justify-center mb-8 relative">
                 <img src={IMAGES.boba} alt="Empty State" className="w-full h-full object-contain opacity-90" />
               </div>
               <h3 className="text-2xl serif font-medium text-[#4A3B2C] mb-3">I'm just here waiting for your charming notes...</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  category={categories.find(c => String(c.id) === String(note.categoryId))}
                  onClick={() => onEditNote(note)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
