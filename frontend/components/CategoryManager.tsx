
import React, { useState } from 'react';
import { Category, Note } from '../types';
import { THEMES } from '../constants';
import { X, Trash2, ArrowRightLeft, Plus, Check } from 'lucide-react';
import { Button } from './Button';
import { apiService } from '../services/api';

interface CategoryManagerProps {
  categories: Category[];
  notes: Note[];
  onUpdateCategories: (cats: Category[]) => void;
  onUpdateNotes: (notes: Note[]) => void;
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories, notes, onUpdateCategories, onUpdateNotes, onClose
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [deleteModeId, setDeleteModeId] = useState<string | null>(null);
  const [moveModeId, setMoveModeId] = useState<string | null>(null);
  const [targetCatId, setTargetCatId] = useState<string>('');

  const handleAddCategory = async () => {
    // Optimistic UI
    const newCat: Category = { id: `temp_cat_${Date.now()}`, name: 'New Category', themeId: 'orange' };
    const updatedList = [...categories, newCat];
    onUpdateCategories(updatedList);
    setEditingId(newCat.id);
    setTempName(newCat.name);
    
    // API Call handled on blur/save usually, or explicitly here if we want to sync ID immediately
    // For this demo, actual save happens when user finishes editing name or immediately here
    try {
        const saved = await apiService.saveCategory(newCat);
        // Replace temp ID
        onUpdateCategories(updatedList.map(c => c.id === newCat.id ? saved : c));
        setEditingId(saved.id); // Continue editing with real ID
    } catch(e) { console.error(e); }
  };

  const saveEditing = async (id: string) => {
    if (!tempName.trim()) return;
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    
    const updatedCat = { ...cat, name: tempName };
    const updatedList = categories.map(c => c.id === id ? updatedCat : c);
    onUpdateCategories(updatedList);
    setEditingId(null);
    await apiService.saveCategory(updatedCat);
  };

  const changeColor = async (id: string, themeId: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    const updatedCat = { ...cat, themeId };
    const updatedList = categories.map(c => c.id === id ? updatedCat : c);
    onUpdateCategories(updatedList);
    await apiService.saveCategory(updatedCat);
  };

  const handleDelete = async (id: string, action: 'delete_all' | 'move', moveTargetId?: string) => {
    // Handle Notes locally for UI
    if (action === 'delete_all') {
        onUpdateNotes(notes.filter(n => String(n.categoryId) !== String(id)));
    } else if (action === 'move' && moveTargetId) {
        onUpdateNotes(notes.map(n => String(n.categoryId) === String(id) ? { ...n, categoryId: moveTargetId } : n));
        // In real backend, we'd call a bulk move endpoint
        const notesToMove = notes.filter(n => String(n.categoryId) === String(id));
        for(const n of notesToMove) {
             await apiService.saveNote({ ...n, categoryId: moveTargetId });
        }
    }

    onUpdateCategories(categories.filter(c => c.id !== id));
    setDeleteModeId(null);
    await apiService.deleteCategory(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3B2C]/40 backdrop-blur-sm">
      <div className="bg-[#FBF7F0] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#8B7355]/20">
        <div className="p-6 border-b border-[#8B7355]/10 flex justify-between items-center bg-white/50">
          <h2 className="text-2xl font-bold serif text-[#4A3B2C]">Manage Categories</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#8B7355]/10 rounded-full"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm border border-[#8B7355]/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: THEMES[cat.themeId]?.bg || '#ccc' }} />
                  {editingId === cat.id ? (
                    <input 
                      autoFocus
                      className="flex-1 text-lg font-bold text-[#4A3B2C] bg-[#F3EFE6] px-3 py-1.5 rounded-lg border-2 border-[#8B7355]/30"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={() => saveEditing(cat.id)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEditing(cat.id)}
                    />
                  ) : (
                    <span className="flex-1 text-lg font-bold text-[#4A3B2C] serif">{cat.name}</span>
                  )}
                  {editingId !== cat.id && (
                    <div className="flex gap-2">
                        <button onClick={() => { setEditingId(cat.id); setTempName(cat.name); }} className="px-3 py-1.5 text-xs font-bold text-[#8B7355] hover:bg-[#F3EFE6] rounded-lg">Edit</button>
                        <button onClick={() => setDeleteModeId(cat.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  )}
                </div>

                {editingId === cat.id && (
                  <div className="flex gap-3 pl-8 pb-2">
                    {Object.entries(THEMES).map(([key, theme]) => (
                      <button
                        key={key}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); changeColor(cat.id, key); }}
                        className={`w-8 h-8 rounded-full border-2 ${cat.themeId === key ? 'border-[#4A3B2C] scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: theme.bg }}
                      />
                    ))}
                  </div>
                )}
                
                {deleteModeId === cat.id && (
                   <div className="mt-4 p-5 bg-red-50/50 rounded-xl border border-red-100">
                     <h4 className="font-bold text-[#C0392B] mb-2">Delete "{cat.name}"?</h4>
                     <div className="flex flex-col gap-3">
                        <button onClick={() => handleDelete(cat.id, 'delete_all')} className="text-left px-4 py-2 bg-white border border-red-100 rounded text-[#C0392B] font-bold">Delete All Notes</button>
                     </div>
                   </div>
                )}
              </div>
            ))}
          </div>
          <Button onClick={handleAddCategory} fullWidth variant="ghost" className="border-2 border-dashed border-[#8B7355]/30 py-4"><Plus size={20} /> New Category</Button>
        </div>
      </div>
    </div>
  );
};
