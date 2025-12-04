'use client';

import React, { useState, useEffect } from 'react';
import { Category, Note } from '@/types';
import { THEMES } from '@/lib/constants';
import { LogOut, Settings, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeCategoryId: number | 'All';
  onSelectCategory: (id: number | 'All') => void;
  categories: Category[];
  notes: Note[];
  onLogout: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategoryId, 
  onSelectCategory, 
  categories,
  notes, 
  onLogout,
  isOpen,
  onCloseMobile,
  onOpenSettings
}) => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  
  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const getCount = (catId: number) => notes.filter(n => n.category_id === catId).length;

  // On mobile/tablet: only render when isOpen is true
  // On desktop: always render
  const shouldRender = isLargeScreen || isOpen;
  
  if (!shouldRender) {
    return null;
  }

  return (
    <>
      {/* Mobile Overlay - only shows when sidebar is open on small screens */}
      {isOpen && !isLargeScreen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onCloseMobile}
        />
      )}
      
      {/* Sidebar Content */}
      <aside 
        className={`
          ${isLargeScreen ? 'relative' : 'fixed inset-y-0 left-0'}
          z-50 bg-[#FBF7F0] flex flex-col h-full border-r border-[#8B7355]/10
          transition-all duration-300 ease-in-out
          ${isLargeScreen && isCollapsed ? 'w-20 px-3' : 'w-72 px-6'}
          py-8 shadow-2xl lg:shadow-none
        `}
      >
        {/* Close button for mobile */}
        {!isLargeScreen && (
          <button 
            onClick={onCloseMobile}
            className="absolute top-4 right-4 p-2 hover:bg-[#F3EFE6] rounded-lg transition-colors text-[#8B7355] hover:text-[#4A3B2C]"
          >
            <X size={20} />
          </button>
        )}

        {/* Collapse Button (Desktop only - Floating on Border) */}
        {isLargeScreen && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 flex items-center justify-center bg-[#FBF7F0] border border-[#8B7355]/40 rounded-full text-[#8B7355] hover:text-[#4A3B2C] hover:border-[#4A3B2C] hover:scale-110 transition-all shadow-sm"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
          </button>
        )}

        {/* Header */}
        <div className={`mb-12 flex ${isLargeScreen && isCollapsed ? 'justify-center' : 'justify-start'} items-start transition-all duration-300`}>
          {!(isLargeScreen && isCollapsed) && (
             <h1 className="text-3xl font-bold font-serif text-[#4A3B2C] leading-tight whitespace-nowrap opacity-100 transition-opacity duration-300">
               JB&apos;s Note Taker <br/><span className="text-xl text-[#8B7355]">Turbo AI</span>
             </h1>
          )}
          {isLargeScreen && isCollapsed && (
              <h1 className="text-xl font-bold font-serif text-[#4A3B2C]">JB</h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3 overflow-y-auto">
          <div className={`mb-4 px-2 flex ${isLargeScreen && isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'} items-center transition-all`}>
            {!(isLargeScreen && isCollapsed) && (
               <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] opacity-80 whitespace-nowrap">
                  Categories
               </span>
            )}
            
            <button 
              onClick={onOpenSettings}
              className={`p-2 hover:bg-[#F3EFE6] rounded-lg transition-colors text-[#8B7355] hover:text-[#4A3B2C] ${isLargeScreen && isCollapsed ? 'bg-[#F3EFE6]/50' : ''}`}
              title="Manage Categories"
            >
              <Settings size={isLargeScreen && isCollapsed ? 20 : 16} />
            </button>
          </div>

          <button
            onClick={() => {
              onSelectCategory('All');
              onCloseMobile();
            }}
            title={isLargeScreen && isCollapsed ? "All Notes" : ""}
            className={`w-full text-left rounded-2xl transition-all duration-200 flex items-center group border border-transparent
              ${isLargeScreen && isCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-4 py-3.5'}
              ${activeCategoryId === 'All' 
                ? 'bg-white shadow-sm border-[#8B7355]/10 font-medium' 
                : 'hover:bg-[#F3EFE6] hover:scale-[1.02]'
            }`}
          >
            {!(isLargeScreen && isCollapsed) ? (
                <>
                  <span className="text-[#4A3B2C]">All Notes</span>
                  <span className={`text-sm px-2 py-0.5 rounded-md transition-colors ${
                     activeCategoryId === 'All' ? 'bg-[#F3EFE6] text-[#4A3B2C]' : 'bg-[#F3EFE6]/50 text-[#8B7355]'
                  }`}>
                    {notes.length}
                  </span>
                </>
            ) : (
                <span className="font-serif font-bold text-[#4A3B2C]">All</span>
            )}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onCloseMobile();
              }}
              title={isLargeScreen && isCollapsed ? cat.name : ""}
              className={`w-full text-left rounded-2xl transition-all duration-200 flex items-center group border border-transparent
                ${isLargeScreen && isCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-4 py-3.5'}
                ${activeCategoryId === cat.id 
                  ? 'bg-white shadow-sm border-[#8B7355]/10 font-medium' 
                  : 'hover:bg-[#F3EFE6] hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`rounded-full shadow-sm transition-all ${isLargeScreen && isCollapsed ? 'w-4 h-4' : 'w-3 h-3'}`}
                  style={{ backgroundColor: THEMES[cat.theme_id]?.bg || '#ccc' }}
                />
                {!(isLargeScreen && isCollapsed) && <span className="truncate text-[#4A3B2C] max-w-[120px]">{cat.name}</span>}
              </div>
              
              {!(isLargeScreen && isCollapsed) && (
                <span className={`text-sm px-2 py-0.5 rounded-md transition-colors ${
                    activeCategoryId === cat.id ? 'bg-[#F3EFE6] text-[#4A3B2C]' : 'bg-[#F3EFE6]/50 text-[#8B7355]'
                }`}>
                  {getCount(cat.id)}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t border-[#8B7355]/10 flex flex-col gap-4">
          {user && (
            <div className={`flex items-center gap-3 ${isLargeScreen && isCollapsed ? 'justify-center' : 'px-4 w-full'}`}>
              <div className="w-10 h-10 rounded-full bg-[#8B7355]/10 flex items-center justify-center text-[#8B7355] font-bold text-lg shrink-0">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              {!(isLargeScreen && isCollapsed) && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-[#4A3B2C] truncate" title={user.email}>
                    {user.email}
                  </span>
                </div>
              )}
            </div>
          )}

          <button 
            onClick={onLogout}
            title={isLargeScreen && isCollapsed ? "Sign Out" : ""}
            className={`flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium
              ${isLargeScreen && isCollapsed ? 'p-3' : 'px-4 py-3 w-full'}
            `}
          >
            <LogOut size={20} />
            {!(isLargeScreen && isCollapsed) && <span>Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
