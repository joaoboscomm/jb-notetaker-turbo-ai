
import React, { useState, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { NoteCard } from '../components/NoteCard';
import { Note, Category } from '../types';
import { Button } from '../components/Button';
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
  notes, 
  categories,
  onLogout, 
  onCreateNote, 
  onEditNote,
  onOpenSettings
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | 'All'>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    if (activeCategoryId === 'All') return notes;
    return notes.filter(n => n.categoryId === activeCategoryId);
  }, [notes, activeCategoryId]);

  const activeCategoryName = activeCategoryId === 'All' 
    ? 'All Categories' 
    : categories.find(c => c.id === activeCategoryId)?.name || 'Unknown';

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
        <header className="px-6 py-5 lg:px-10 flex justify-between items-center bg-[#FBF7F0] shrink-0 border-b border-[#8B7355]/5 lg:border-none">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 hover:bg-[#F3EFE6] rounded-xl transition-colors"
              >
                <Menu size={24} color="#4A3B2C" />
              </button>
              
              <div className="flex flex-col lg:hidden">
                 <h1 className="text-xl font-bold serif text-[#4A3B2C]">JB's Note Taker</h1>
              </div>

              <div className="hidden lg:block">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#8B7355] opacity-50">
                    {activeCategoryName}
                 </h2>
              </div>
           </div>

           <Button onClick={onCreateNote} className="shadow-sm hover:shadow-md">
             <Plus size={18} strokeWidth={2.5} />
             <span>New Note</span>
           </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4 lg:px-10">
          {filteredNotes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center -mt-10">
               {/* Illustration Placeholder */}
               <div className="w-56 h-56 flex items-center justify-center mb-8 relative">
                 <img src={IMAGES.boba} alt="Empty State" className="w-full h-full object-contain opacity-90" />
               </div>
               
               <h3 className="text-2xl serif font-medium text-[#4A3B2C] mb-3 max-w-md leading-normal">
                 I'm just here waiting for your charming notes...
               </h3>
               
               {activeCategoryId !== 'All' && (
                 <p className="text-[#8B7355] opacity-70">
                   It looks a bit empty in "{activeCategoryName}".
                 </p>
               )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  category={categories.find(c => c.id === note.categoryId)}
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
