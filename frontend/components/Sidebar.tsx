
import React, { useState } from 'react';
import { Category, Note } from '../types';
import { THEMES } from '../constants';
import { LogOut, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeCategoryId: string | 'All';
  onSelectCategory: (id: string | 'All') => void;
  categories: Category[];
  notes: Note[];
  onLogout: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategoryId, onSelectCategory, categories, notes, onLogout, isOpen, onCloseMobile, onOpenSettings
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const getCount = (catId: string) => notes.filter(n => String(n.categoryId) === String(catId)).length;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/20 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      />
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        bg-[#FBF7F0] flex flex-col h-full border-r border-[#8B7355]/10
        transform transition-all duration-300 ease-in-out relative
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20 lg:px-3' : 'lg:w-72 lg:px-6'}
        px-6 py-8 shadow-2xl lg:shadow-none
      `}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 items-center justify-center bg-[#FBF7F0] border border-[#8B7355]/40 rounded-full text-[#8B7355] hover:text-[#4A3B2C]"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`mb-12 flex ${isCollapsed ? 'lg:justify-center' : 'justify-start'} items-start`}>
          {!isCollapsed ? (
             <h1 className="text-3xl font-bold serif text-[#4A3B2C] leading-tight">JB's Note Taker <br/><span className="text-xl text-[#8B7355]">Turbo AI</span></h1>
          ) : (
              <h1 className="text-xl font-bold serif text-[#4A3B2C] hidden lg:block">JB</h1>
          )}
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
          <div className={`mb-4 px-2 flex ${isCollapsed ? 'lg:justify-center lg:flex-col lg:gap-4' : 'justify-between'} items-center`}>
            {!isCollapsed && <span className="text-xs font-bold uppercase text-[#8B7355]">Categories</span>}
            <button onClick={onOpenSettings} className="p-2 hover:bg-[#F3EFE6] rounded-lg text-[#8B7355]">
              <Settings size={isCollapsed ? 20 : 16} />
            </button>
          </div>

          <button
            onClick={() => { onSelectCategory('All'); onCloseMobile(); }}
            className={`w-full text-left rounded-2xl transition-all flex items-center
              ${isCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-4 py-3.5'}
              ${activeCategoryId === 'All' ? 'bg-white shadow-sm font-medium' : 'hover:bg-[#F3EFE6]'}`
            }
          >
            {!isCollapsed ? (
                <>
                  <span className="text-[#4A3B2C]">All Notes</span>
                  <span className="text-sm px-2 py-0.5 bg-[#F3EFE6] rounded-md">{notes.length}</span>
                </>
            ) : <span className="font-serif font-bold text-[#4A3B2C]">All</span>}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.id); onCloseMobile(); }}
              className={`w-full text-left rounded-2xl transition-all flex items-center
                ${isCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-4 py-3.5'}
                ${String(activeCategoryId) === String(cat.id) ? 'bg-white shadow-sm font-medium' : 'hover:bg-[#F3EFE6]'}`
              }
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full ${isCollapsed ? 'w-4 h-4' : 'w-3 h-3'}`} style={{ backgroundColor: THEMES[cat.themeId]?.bg || '#ccc' }} />
                {!isCollapsed && <span className="truncate text-[#4A3B2C] max-w-[120px]">{cat.name}</span>}
              </div>
              {!isCollapsed && <span className="text-sm px-2 py-0.5 bg-[#F3EFE6]/50 rounded-md">{getCount(cat.id)}</span>}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#8B7355]/10">
          <button onClick={onLogout} className={`flex items-center gap-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 w-full'}`}>
            <LogOut size={20} />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </>
  );
};
