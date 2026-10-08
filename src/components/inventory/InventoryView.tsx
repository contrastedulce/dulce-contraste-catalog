import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Package, 
  AlertTriangle, 
  ArrowRightLeft, 
  Pencil, 
  Trash2, 
  Minus 
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { cn } from '../../lib/utils';
import { Supply } from '../../types';

import Fuse from 'fuse.js';

interface InventoryViewProps {
  supplies: Supply[];
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
  inventoryFilter: 'all' | 'critical';
  setInventoryFilter: (filter: 'all' | 'critical') => void;
  isStockAdjustMode: boolean;
  setIsStockAdjustMode: (val: boolean) => void;
  aiCooldown: number;
  onImportIA: () => void;
  onAddSupply: () => void;
  onEditSupply: (supply: Supply) => void;
  onDeleteSupply: (id: string) => void;
  handleStockChange: (id: string, delta: number) => void;
  handleStockInput: (id: string, value: number) => void;
  formatCurrency: (amount: number) => string;
}

const PAGE_SIZE = 50;

export const InventoryView = React.memo<InventoryViewProps>(({
  supplies,
  globalSearch,
  setGlobalSearch,
  inventoryFilter,
  setInventoryFilter,
  isStockAdjustMode,
  setIsStockAdjustMode,
  aiCooldown,
  onImportIA,
  onAddSupply,
  onEditSupply,
  onDeleteSupply,
  handleStockChange,
  handleStockInput,
  formatCurrency
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const searchTerm = localSearch || globalSearch;

  // Initialize Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(supplies, {
      keys: ['name', 'category'],
      threshold: 0.35, // Allows moderate typo tolerance
      distance: 100,
      ignoreLocation: true
    });
  }, [supplies]);

  const filteredSupplies = useMemo(() => {
    let result = supplies;
    const isSearching = searchTerm.trim() !== '';
    
    if (isSearching) {
      result = fuse.search(searchTerm).map(res => res.item);
    }

    const filtered = result.filter(s => {
      return inventoryFilter === 'all' || s.stock <= s.minStock;
    });

    // If searching, keep Fuse's relevance sorting. Otherwise, sort alphabetically.
    if (isSearching) {
      return filtered;
    }

    return [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [supplies, searchTerm, inventoryFilter, fuse]);

  const visibleSupplies = filteredSupplies.slice(0, visibleCount);

  const hasMore = filteredSupplies.length > visibleCount;


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Inventario</h2>
          <p className="text-slate-500 font-medium mt-1">Gestión de materia prima, packaging y control de existencias.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant={isStockAdjustMode ? 'warning' : 'secondary'}
            onClick={() => setIsStockAdjustMode(!isStockAdjustMode)}
            icon={ArrowRightLeft}
            className={cn(isStockAdjustMode && "animate-pulse")}
          >
            {isStockAdjustMode ? 'Guardar Ajustes' : 'Ajuste Rápido'}
          </Button>
          <Button 
            variant="primary" 
            onClick={onAddSupply}
            icon={Plus}
          >
            Nuevo Insumo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Secos', 'Lácteos', 'Frescos', 'Packaging'].map((cat, i) => (
          <GlassCard key={cat} delay={i * 0.05} className="p-6 border-none shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{cat}</p>
            <h4 className="text-3xl font-black text-slate-800">
              {supplies.filter(s => s.category === cat).length}
              <span className="text-xs text-slate-400 ml-2 font-bold uppercase tracking-tighter">Items</span>
            </h4>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-0 border-none shadow-sm overflow-hidden" delay={0.2}>
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="text" 
              value={localSearch}
              onChange={(e) => { setLocalSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              placeholder="Buscar insumos o categorías..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 transition-all font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          
          <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-100/50">
            <button 
              onClick={() => setInventoryFilter('all')}
              className={cn(
                "px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                inventoryFilter === 'all' ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Todos
            </button>
            <button 
              onClick={() => setInventoryFilter('critical')}
              className={cn(
                "px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
                inventoryFilter === 'critical' ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Críticos
              <Badge variant="rose" className="px-1.5 py-0 min-w-5 text-center">
                {supplies.filter(s => s.stock <= s.minStock).length}
              </Badge>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Insumo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Categoría</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock Activo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Costo Unit.</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleSupplies.map((supply) => (
                <tr key={supply.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                        supply.stock <= supply.minStock ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"
                      )}>
                        {supply.stock <= supply.minStock ? <AlertTriangle className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 leading-tight">{supply.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Unidad: {supply.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <Badge variant="slate" className="bg-slate-100 text-slate-600 border-none">
                      {supply.category}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                      {isStockAdjustMode ? (
                        <div className="flex items-center gap-3 bg-amber-50 p-1.5 rounded-xl border border-amber-100 shadow-sm">
                          <button 
                            onClick={() => handleStockChange(supply.id, -1)}
                            className="p-1.5 hover:bg-white rounded-lg text-amber-600 transition-all active:scale-90"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input 
                            type="number"
                            value={supply.stock}
                            onChange={(e) => handleStockInput(supply.id, parseFloat(e.target.value))}
                            className="w-20 bg-transparent border-none text-center font-black text-sm text-amber-700 focus:ring-0 p-0"
                          />
                          <button 
                            onClick={() => handleStockChange(supply.id, 1)}
                            className="p-1.5 hover:bg-white rounded-lg text-amber-600 transition-all active:scale-90"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className={cn(
                            "text-lg font-black tabular-nums",
                            supply.stock <= supply.minStock ? "text-rose-500" : "text-slate-800"
                          )}>
                            {supply.stock} <span className="text-[10px] uppercase opacity-40 ml-1">{supply.unit}</span>
                          </span>
                          {supply.stock <= supply.minStock && (
                            <div className="text-[8px] font-black text-rose-400 uppercase tracking-widest mt-0.5 animate-pulse">Bajo Mínimo ({supply.minStock})</div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-black text-slate-800 tabular-nums">
                    {formatCurrency(supply.cost)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditSupply(supply)}
                        className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteSupply(supply.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {hasMore && (
            <div className="py-4 text-center border-t border-slate-100">
              <button 
                onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest transition-all"
              >
                Mostrar más ({filteredSupplies.length - visibleCount} restantes)
              </button>
            </div>
          )}

          {filteredSupplies.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                <Package size={40} />
              </div>
              <h3 className="text-lg font-black text-slate-800">No se encontraron insumos</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ajusta los filtros o intenta con otra búsqueda</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
});
