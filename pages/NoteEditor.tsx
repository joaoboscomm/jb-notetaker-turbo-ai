
import React, { useState, useEffect, useCallback } from 'react';
import { Note, Category } from '../types';
import { THEMES } from '../constants';
import { X, ChevronDown, Trash2 } from 'lucide-react';
import { Button } from '../components/Button';

interface NoteEditorProps {
  note: Note;
  categories: Category[];
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  note, 
  categories, 
  onSave, 
  onDelete, 
  onClose 
}) => {
  // Initialize state with note props
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [categoryId, setCategoryId] = useState(note.categoryId);
  const [lastEdited, setLastEdited] = useState(note.updatedAt);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state if note prop changes externally (e.g. from a save)
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setCategoryId(note.categoryId);
    setLastEdited(note.updatedAt);
  }, [note.id]); // Only reset if ID changes to avoid cursor jumping

  // Save Function
  const saveChanges = useCallback((newTitle: string, newContent: string, newCatId: string) => {
     const now = new Date().toISOString();
     setLastEdited(now);
     onSave({
       ...note,
       title: newTitle,
       content: newContent,
       categoryId: newCatId,
       updatedAt: now
     });
  }, [note, onSave]);

  // Debounced Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        title !== note.title || 
        content !== note.content || 
        categoryId !== note.categoryId
      ) {
        saveChanges(title, content, categoryId);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [title, content, categoryId, note, saveChanges]);

  // Handle Close (Force Save)
  const handleClose = () => {
    // If there are unsaved changes pending debounce, save them immediately
    if (
      title !== note.title || 
      content !== note.content || 
      categoryId !== note.categoryId
    ) {
      saveChanges(title, content, categoryId);
    }
    onClose();
  };

  const activeCategory = categories.find(c => c.id === categoryId) || categories[0];
  const currentTheme = THEMES[activeCategory?.themeId] || THEMES['orange'];

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    onDelete(note.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-4xl h-full max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative transition-colors duration-500"
        style={{ 
          backgroundColor: currentTheme.bg,
          border: `4px solid ${currentTheme.border}`
        }}
      >
        {/* Header */}
        <header className="px-6 py-6 md:px-8 md:py-8 flex justify-between items-start shrink-0">
           <div className="flex flex-col gap-1.5">
             <div className="relative z-20">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity text-[#4A3B2C]"
                >
                  <div className="w-2 h-2 rounded-full bg-[#4A3B2C]"></div>
                  {activeCategory?.name}
                  <ChevronDown size={14} strokeWidth={3} />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#FBF7F0] rounded-xl shadow-xl py-2 z-30 animate-in fade-in zoom-in-95 duration-200 border border-[#8B7355]/20 max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategoryId(cat.id);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-[#F3EFE6] text-sm font-medium flex items-center gap-3 text-[#4A3B2C]"
                      >
                         <div 
                           className="w-3 h-3 rounded-full border border-black/10" 
                           style={{ backgroundColor: THEMES[cat.themeId]?.bg }} 
                         />
                         {cat.name}
                      </button>
                    ))}
                  </div>
                )}
             </div>
             <span className="text-xs font-medium opacity-50 text-[#4A3B2C]">
               Last Edited: {formatDate(lastEdited)}
             </span>
           </div>

           <div className="flex items-center gap-2">
              <button 
               onClick={() => setShowDeleteConfirm(true)}
               className="p-3 rounded-full hover:bg-black/5 text-[#5A4633] transition-colors group"
               title="Delete Note"
              >
                <Trash2 size={22} className="group-hover:text-red-600 transition-colors" />
              </button>
              <button 
                onClick={handleClose}
                className="p-3 rounded-full hover:bg-black/5 text-[#5A4633] transition-colors"
                title="Close"
              >
                <X size={28} />
              </button>
           </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 md:px-8 pb-8 overflow-y-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="bg-transparent text-4xl sm:text-5xl font-bold serif text-[#4A3B2C] placeholder-[#4A3B2C]/30 focus:outline-none mb-6 w-full leading-tight"
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your note here..."
            className="flex-1 bg-transparent text-lg text-[#4A3B2C] placeholder-[#4A3B2C]/40 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
             <div className="bg-[#FBF7F0] p-6 rounded-2xl shadow-xl max-w-sm w-full border border-[#8B7355]/10 transform scale-100 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold serif text-[#4A3B2C] mb-2">Delete Note?</h3>
                <p className="text-[#8B7355] mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                   <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                     Cancel
                   </Button>
                   <button 
                     onClick={handleDelete}
                     className="px-6 py-3 rounded-full font-medium bg-red-500 text-white hover:bg-red-600 transition-colors active:scale-95"
                   >
                     Delete
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
