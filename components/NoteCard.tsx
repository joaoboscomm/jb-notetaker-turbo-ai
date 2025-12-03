
import React from 'react';
import { Note, Category } from '../types';
import { THEMES } from '../constants';

interface NoteCardProps {
  note: Note;
  category?: Category;
  onClick: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, category, onClick }) => {
  const theme = category ? THEMES[category.themeId] : THEMES['orange'];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'today';
    if (isYesterday) return 'yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <div 
      onClick={onClick}
      className="p-6 rounded-2xl cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col gap-2 h-[280px]"
      style={{ 
        backgroundColor: theme?.bg || '#fff',
        borderWidth: '2px',
        borderColor: theme?.border || '#ccc',
        borderStyle: 'solid'
      }}
    >
      <div className="flex justify-between items-baseline mb-2 opacity-90 text-sm font-bold tracking-wide text-[#4A3B2C]">
        <span>{formatDate(note.updatedAt)}</span>
        <span className="truncate max-w-[50%]">{category?.name}</span>
      </div>
      
      <h3 className="text-2xl font-bold serif mb-1 line-clamp-2 leading-tight text-[#4A3B2C]">
        {note.title || "Untitled Note"}
      </h3>
      
      <p className="text-[#4A3B2C]/80 line-clamp-6 text-sm leading-relaxed whitespace-pre-wrap">
        {note.content || "No content..."}
      </p>
    </div>
  );
};
