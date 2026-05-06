import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Option {
  id: string;
  name: string;
  unit?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  onAddNew?: (search: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  onAddNew,
  placeholder = "Buscar...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === value);
  const filteredOptions = options.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full p-2.5 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50/50",
          isOpen ? "border-primary ring-2 ring-primary/10 shadow-sm" : "border-gray-200"
        )}
      >
        <span className={cn(
          "text-xs truncate transition-all",
          selectedOption ? "font-bold text-gray-900" : "text-gray-400 font-medium"
        )}>
          {selectedOption ? `${selectedOption.name} (${selectedOption.unit || ''})` : placeholder}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-100">
          <div className="p-2 border-b border-gray-50 bg-gray-50/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Escribe para filtrar..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-0 focus:border-primary font-medium"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto pt-1 pb-1">
            {filteredOptions.map((opt) => (
              <div
                key={opt.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={cn(
                  "px-4 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between",
                  value === opt.id ? "bg-primary/5 text-primary font-bold" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <span className="truncate">{opt.name} <span className="opacity-50 text-[10px] ml-1 uppercase">{opt.unit}</span></span>
                {value === opt.id && <Check className="w-3.5 h-3.5" />}
              </div>
            ))}
            
            {onAddNew && search.trim() && (
              <div className="p-2 border-t border-gray-50 mt-1">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onAddNew(search.trim());
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="w-full p-2.5 bg-primary/5 text-primary text-[10px] font-bold rounded-xl border border-primary/20 hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar "{search.trim()}" como nuevo
                </button>
              </div>
            )}

            {filteredOptions.length === 0 && !search.trim() && (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  Comienza a escribir...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
