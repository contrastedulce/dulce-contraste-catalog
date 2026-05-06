import React from 'react';
import { Search, Plus, Bell, ChefHat } from 'lucide-react';
import { cn } from '../../lib/utils';
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
    <header className="h-20 glass-morphism border-b bg-white/50 border-slate-100 flex items-center justify-between px-8 shrink-0 z-20 sticky top-0">
      <div className="flex items-center gap-4 bg-slate-50 border-2 border-slate-100 px-5 py-2.5 rounded-2xl w-full max-w-md focus-within:bg-white focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-600/5 transition-all relative group">
        <Search className="w-4 h-4 text-slate-400 font-black group-focus-within:text-primary-600" />
        <input 
          type="text" 
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Busca recetas, pedidos o insumos..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium"
        />
        {globalSearch && (
          <button 
            onClick={() => setGlobalSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <Plus className="w-3 h-3 rotate-45 text-slate-400" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-6">
        <Button 
          onClick={onNewOrder}
          icon={Plus}
          size="md"
          className="shadow-xl"
        >
          Nuevo Pedido
        </Button>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-4">
          <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800">{userName}</p>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-tight">{userRole}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <ChefHat className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
