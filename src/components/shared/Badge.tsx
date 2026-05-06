import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'slate' | 'rose' | 'emerald' | 'amber' | 'blue' | 'purple';
  size?: 'xs' | 'sm';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'slate', 
  size = 'xs',
  className 
}) => {
  const variants = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  const sizes = {
    xs: "px-2.5 py-0.5 text-[10px]",
    sm: "px-3 py-1 text-xs",
  };

  return (
    <span className={cn(
      "inline-flex items-center font-black uppercase tracking-widest border rounded-full transition-all duration-300",
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};
