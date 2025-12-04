import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  className = '', 
  icon,
  onIconClick,
  ...props 
}, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-[#5A4633] ml-1">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          className={`w-full bg-[#F3EFE6] border border-[#8B7355] rounded-lg px-4 py-3 text-[#4A3B2C] placeholder-[#8B7355]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 transition-all ${className}`}
          {...props}
        />
        {icon && (
          <button 
            type="button"
            onClick={onIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#5A4633] p-1"
          >
            {icon}
          </button>
        )}
      </div>
      {error && <span className="text-red-500 text-xs ml-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
