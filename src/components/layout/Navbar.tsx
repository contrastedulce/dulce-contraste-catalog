import React from 'react';
import { Search, Plus, Bell, ChefHat } from 'lucide-react';
import { Button } from '../shared/Button';

interface NavbarProps {
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  onNewOrder: () => void;
  userName?: string;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  globalSearch, 
  setGlobalSearch, 
  onNewOrder,
  userName = "Chef Admin",
  userRole = "Propietario"
}) => {
  return (
    <header className="h-18 bg-white/80 backdrop-blur-xl border-b border-rose-100/40 flex items-center justify-between px-6 md:px-8 shrink-0 z-20 sticky top-0 shadow-sm shadow-rose-100/20">
      {/* Search */}
      <div className="flex items-center gap-3 bg-[#FFF0E8] border border-rose-100 px-4 py-2.5 rounded-2xl w-full max-w-sm focus-within:bg-white focus-within:border-rose-300 focus-within:ring-4 focus-within:ring-rose-500/8 transition-all relative group">
        <Search className="w-4 h-4 text-rose-300 group-focus-within:text-rose-500 transition-colors shrink-0" />
        <input 
          type="text" 
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Busca recetas, pedidos o insumos..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-rose-300/70 font-medium text-slate-700"
        />
        {globalSearch && (
          <button 
            onClick={() => setGlobalSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-rose-100 rounded-full transition-colors"
          >
            <Plus className="w-3 h-3 rotate-45 text-rose-400" />
          </button>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        <Button 
          onClick={onNewOrder}
          icon={Plus}
          size="md"
          className="shadow-lg shadow-rose-500/20 btn-press"
        >
          Nuevo Pedido
        </Button>

        <div className="h-7 w-px bg-rose-100" />

        {/* Bell */}
        <button className="p-2.5 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all relative btn-press">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
        </button>
        
        {/* User */}
        <div className="flex items-center gap-3 pl-1 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-800 leading-tight">{userName}</p>
            <p className="text-[9px] text-rose-400 font-black uppercase tracking-widest leading-tight">{userRole}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-300/30 group-hover:shadow-rose-300/50 group-hover:scale-105 transition-all btn-press">
            <ChefHat className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
