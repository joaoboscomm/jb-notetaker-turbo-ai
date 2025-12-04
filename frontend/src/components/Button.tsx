import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  
  const variants = {
    primary: "bg-[#F4EBD0] text-[#5A4633] border border-[#8B7355] hover:bg-[#EBE0C0]",
    secondary: "bg-[#4A3B2C] text-[#FBF7F0] hover:bg-[#3A2E22]",
    ghost: "bg-transparent text-[#5A4633] hover:bg-[#0000000d]"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
