
import React, { useState } from 'react';
import { Category, Note } from '../types';
import { THEMES } from '../constants';
import { X, Trash2, ArrowRightLeft, Plus, Check } from 'lucide-react';
import { Button } from './Button';

interface CategoryManagerProps {
  categories: Category[];
  notes: Note[];
  onUpdateCategories: (cats: Category[]) => void;
  onUpdateNotes: (notes: Note[]) => void;
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  notes,
  onUpdateCategories,
  onUpdateNotes,
  onClose
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [deleteModeId, setDeleteModeId] = useState<string | null>(null);
  const [moveModeId, setMoveModeId] = useState<string | null>(null);
  const [targetCatId, setTargetCatId] = useState<string>('');
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set());

  // Create new category
  const handleAddCategory = () => {
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name: 'New Category',
      themeId: 'orange'
    };
    onUpdateCategories([...categories, newCat]);
    setEditingId(newCat.id);
    setTempName(newCat.name);
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setTempName(cat.name);
    setDeleteModeId(null);
    setMoveModeId(null);
  };

  const saveEditing = (id: string) => {
    if (!tempName.trim()) return; // Prevent empty names
    const updated = categories.map(c => c.id === id ? { ...c, name: tempName } : c);
    onUpdateCategories(updated);
    setEditingId(null);
  };

  const changeColor = (id: string, themeId: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, themeId } : c);
    onUpdateCategories(updated);
  };

  const handleDelete = (id: string, action: 'delete_all' | 'move', moveTargetId?: string) => {
    // 1. Handle Notes
    const notesInCat = notes.filter(n => n.categoryId === id);
    
    if (notesInCat.length > 0) {
      if (action === 'delete_all') {
        onUpdateNotes(notes.filter(n => n.categoryId !== id));
      } else if (action === 'move' && moveTargetId) {
        const updatedNotes = notes.map(n => n.categoryId === id ? { ...n, categoryId: moveTargetId } : n);
        onUpdateNotes(updatedNotes);
      }
    }

    // 2. Delete Category
    onUpdateCategories(categories.filter(c => c.id !== id));
    setDeleteModeId(null);
  };

  const handleMoveNotes = () => {
    if (!moveModeId || !targetCatId) return;
    
    // Move only selected notes
    const updatedNotes = notes.map(n => 
      (n.categoryId === moveModeId && selectedNoteIds.has(n.id)) 
        ? { ...n, categoryId: targetCatId } 
        : n
    );
    
    onUpdateNotes(updatedNotes);
    setMoveModeId(null);
    setSelectedNoteIds(new Set());
  };

  const toggleNoteSelection = (noteId: string) => {
    const newSet = new Set(selectedNoteIds);
    if (newSet.has(noteId)) newSet.delete(noteId);
    else newSet.add(noteId);
    setSelectedNoteIds(newSet);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3B2C]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FBF7F0] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#8B7355]/20 scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-[#8B7355]/10 flex justify-between items-center bg-white/50">
          <h2 className="text-2xl font-bold serif text-[#4A3B2C]">Manage Categories</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-[#8B7355]/10 rounded-full transition-colors text-[#4A3B2C]"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm border border-[#8B7355]/10 transition-all hover:border-[#8B7355]/30">
                
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: THEMES[cat.themeId]?.bg || '#ccc' }}
                  />
                  
                  {editingId === cat.id ? (
                    <div className="flex-1 flex items-center gap-2">
                        <input 
                        autoFocus
                        className="flex-1 text-lg font-bold text-[#4A3B2C] bg-[#F3EFE6] px-3 py-1.5 rounded-lg focus:outline-none border-2 border-[#8B7355]/30 focus:border-[#8B7355] serif"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={() => saveEditing(cat.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditing(cat.id)}
                        />
                    </div>
                  ) : (
                    <span className="flex-1 text-lg font-bold text-[#4A3B2C] serif">{cat.name}</span>
                  )}

                  <div className="flex gap-2">
                    {editingId !== cat.id && (
                        <>
                        <button 
                        onClick={() => startEditing(cat)}
                        className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8B7355] hover:bg-[#F3EFE6] rounded-lg transition-colors"
                        >
                        Edit
                        </button>
                        
                        <button 
                        onClick={() => {
                            setDeleteModeId(cat.id === deleteModeId ? null : cat.id);
                            setMoveModeId(null);
                        }}
                        className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete Category"
                        >
                        <Trash2 size={18} />
                        </button>

                        <button 
                        onClick={() => {
                            setMoveModeId(cat.id === moveModeId ? null : cat.id);
                            setDeleteModeId(null);
                            setSelectedNoteIds(new Set()); 
                        }}
                        className="p-1.5 text-[#8B7355] hover:bg-[#F3EFE6] rounded-lg transition-colors"
                        title="Move Notes"
                        >
                        <ArrowRightLeft size={18} />
                        </button>
                        </>
                    )}
                  </div>
                </div>

                {/* Color Palette (Visible when editing) */}
                {editingId === cat.id && (
                  <div className="flex gap-3 pl-8 pb-2 animate-in slide-in-from-top-1 fade-in duration-200">
                    {Object.entries(THEMES).map(([key, theme]) => (
                      <button
                        key={key}
                        type="button" // Important: prevents form submission behaviors
                        onMouseDown={(e) => {
                            // CRITICAL FIX: Prevent default ensures the input doesn't blur when clicking the button
                            e.preventDefault(); 
                            changeColor(cat.id, key);
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                            cat.themeId === key 
                            ? 'border-[#4A3B2C] scale-110 shadow-sm' 
                            : 'border-transparent hover:scale-110 hover:shadow-sm'
                        }`}
                        style={{ backgroundColor: theme.bg }}
                        title={theme.label}
                      >
                         {cat.themeId === key && <Check size={14} className="text-[#4A3B2C]" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Delete Mode UI */}
                {deleteModeId === cat.id && (
                  <div className="mt-4 p-5 bg-red-50/50 rounded-xl border border-red-100 animate-in slide-in-from-top-2">
                    <h4 className="font-bold serif text-[#C0392B] mb-2 text-lg">Delete "{cat.name}"?</h4>
                    <p className="text-sm text-[#C0392B]/80 mb-4 font-medium">There are {notes.filter(n => n.categoryId === cat.id).length} notes in this category.</p>
                    
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => handleDelete(cat.id, 'delete_all')}
                        className="text-left px-4 py-3 bg-white border border-red-100 rounded-lg text-[#C0392B] hover:bg-red-50 hover:border-red-200 text-sm font-bold transition-colors shadow-sm"
                      >
                        Delete category & all notes inside
                      </button>
                      
                      {categories.length > 1 && (
                        <div className="flex gap-2">
                          <select 
                            className="flex-1 px-4 py-2 bg-white border border-red-100 rounded-lg text-sm focus:outline-none text-[#4A3B2C] shadow-sm cursor-pointer hover:border-red-200"
                            onChange={(e) => setTargetCatId(e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select category to move notes...</option>
                            {categories.filter(c => c.id !== cat.id).map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <button 
                            disabled={!targetCatId}
                            onClick={() => handleDelete(cat.id, 'move', targetCatId)}
                            className="px-6 py-2 bg-[#C0392B] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#A93226] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Move & Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Move Mode UI */}
                {moveModeId === cat.id && (
                  <div className="mt-4 p-5 bg-[#F3EFE6] rounded-xl border border-[#8B7355]/20 animate-in slide-in-from-top-2">
                    <h4 className="font-bold serif text-[#4A3B2C] mb-3 text-lg">Move Notes from "{cat.name}"</h4>
                    
                    <div className="mb-4 max-h-48 overflow-y-auto border border-[#8B7355]/10 rounded-lg bg-white p-2 shadow-inner custom-scrollbar">
                      {notes.filter(n => n.categoryId === cat.id).length === 0 ? (
                         <p className="text-sm text-[#8B7355]/50 italic p-2">No notes to move.</p>
                      ) : (
                        notes.filter(n => n.categoryId === cat.id).map(note => (
                          <label key={note.id} className="flex items-center gap-3 p-2 hover:bg-[#F3EFE6]/50 rounded-lg cursor-pointer transition-colors group">
                            <input 
                              type="checkbox" 
                              checked={selectedNoteIds.has(note.id)}
                              onChange={() => toggleNoteSelection(note.id)}
                              className="w-4 h-4 accent-[#8B7355] cursor-pointer"
                            />
                            <span className="text-sm font-medium text-[#4A3B2C] truncate group-hover:text-[#8B7355] transition-colors">{note.title || "Untitled Note"}</span>
                          </label>
                        ))
                      )}
                    </div>

                    <div className="flex gap-3">
                      <select 
                        className="flex-1 px-4 py-2.5 bg-white border border-[#8B7355]/20 rounded-lg text-sm focus:outline-none focus:border-[#8B7355] text-[#4A3B2C] shadow-sm cursor-pointer"
                        onChange={(e) => setTargetCatId(e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Move selected to...</option>
                        {categories.filter(c => c.id !== cat.id).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <button 
                        disabled={!targetCatId || selectedNoteIds.size === 0}
                        onClick={handleMoveNotes}
                        className="px-6 py-2 bg-[#4A3B2C] text-[#FBF7F0] rounded-lg text-sm font-bold shadow-sm hover:bg-[#3A2E22] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Move Notes
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          <Button onClick={handleAddCategory} fullWidth variant="ghost" className="border-2 border-dashed border-[#8B7355]/30 py-4 hover:bg-[#F3EFE6] hover:border-[#8B7355] text-[#8B7355]">
            <Plus size={20} />
            <span>Create New Category</span>
          </Button>

        </div>
      </div>
    </div>
  );
};
