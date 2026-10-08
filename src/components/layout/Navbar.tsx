import React from 'react';
import { Search, Plus, Bell } from 'lucide-react';

interface NavbarProps {
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  onNewOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  globalSearch,
  setGlobalSearch,
  onNewOrder
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-rose-100/60 px-6 shadow-xs" style={{ backgroundColor: '#FFF8F2' }}>
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-rose-300" />
          </span>
          <input
            type="text"
            placeholder="Buscar recetas, insumos, clientes..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full rounded-2xl border border-rose-100/50 bg-white/50 py-2 pl-10 pr-4 text-xs text-rose-950 placeholder-rose-300 outline-none transition-all focus:border-rose-300 focus:bg-white/80"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onNewOrder}
          className="flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-200/50 transition-all hover:bg-rose-600 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Orden</span>
        </button>

        <button className="relative rounded-2xl border border-rose-100/50 bg-white/50 p-2 text-rose-400 hover:text-rose-600 hover:bg-white/80">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
        </button>
      </div>
    </header>
  );
};
