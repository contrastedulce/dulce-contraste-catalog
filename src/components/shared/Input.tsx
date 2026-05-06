import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  compact?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  icon: Icon, 
  error, 
  className, 
  id,
  compact,
  ...props 
}) => {
  return (
    <div className="space-y-2 w-full group">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary-600"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 text-slate-400 font-bold",
            compact ? "left-3" : "left-4"
          )}>
            <Icon className={compact ? "w-3 h-3" : "w-4 h-4"} />
          </div>
        )}
        <input
          id={id}
          className={cn(
            "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium transition-all focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-600/5 outline-none placeholder:text-slate-300",
            compact ? "p-2 text-[11px]" : "p-3.5 text-sm",
            Icon && (compact ? "pl-8" : "pl-12"),
            error && "border-rose-400 focus:border-rose-400 focus:ring-rose-500/5",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase">{error}</p>
      )}
    </div>
  );
};
