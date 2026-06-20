import React from 'react';
import { Plus, Cake, Pencil, Trash2, Search, LayoutGrid, List, Power } from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { cn } from '../../lib/utils';
import { Product, Recipe } from '../../types';

interface ProductsViewProps {
  products: Product[];
  recipes: Recipe[];
  globalSearch: string;
  setGlobalSearch?: (val: string) => void;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  getProductCost: (product: Product, formatName: string) => { total: number; variable: number; fixed: number };
  formatCurrency: (amount: number) => string;
}

export const ProductsView = React.memo<ProductsViewProps>(({
  products,
  recipes,
  globalSearch,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleVisibility,
  getProductCost,
  formatCurrency,
  setGlobalSearch
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('products_view_mode') as 'grid' | 'list') || 'grid';
  });

  const handleSetViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('products_view_mode', mode);
  };

  const filteredProducts = products
    .filter(p => 
      (p.name || '').toLowerCase().includes(globalSearch.toLowerCase())
    )
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Presentaciones</h2>
          <p className="text-slate-500 font-medium mt-1">Formatos de venta, precios al público y márgenes de ganancia.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={onAddProduct}
          icon={Plus}
          className="shrink-0"
        >
          Nueva Presentación
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-fit shadow-inner border border-slate-100/50">
          <button 
            onClick={() => handleSetViewMode('grid')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? "bg-white text-blue-600 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
            title="Vista de Cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleSetViewMode('list')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? "bg-white text-blue-600 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
            title="Vista de Lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <div className="relative flex-1 w-full max-sm:w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input 
            type="text" 
            value={globalSearch}
            onChange={(e) => setGlobalSearch?.(e.target.value)}
            placeholder="Buscar presentaciones..." 
            className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300"
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-3"}>
          {filteredProducts.map((product, idx) => {
            const recipe = recipes.find(r => r.id === product.recipeId);
            const isList = viewMode === 'list';
            
            return (
              <GlassCard 
                key={product.id} 
                delay={idx * 0.05}
                className={cn(
                  "group border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-3xl",
                  isList ? "p-4 px-6" : "p-8"
                )}
              >
                <div className={cn("relative z-10 flex flex-col", isList && "md:flex-row md:items-center gap-6")}>
                  <div className={cn("flex items-start justify-between shrink-0", !isList && "mb-8")}>
                    <div className={cn(
                      "bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500",
                      isList ? "w-10 h-10" : "w-16 h-16"
                    )}>
                      <Cake className={isList ? "w-5 h-5" : "w-8 h-8"} />
                    </div>
                    {!isList && (
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => onToggleVisibility?.(product.id)}
                          className={cn(
                            "p-2.5 bg-white rounded-xl shadow-sm border transition-all",
                            product.isActive !== false 
                              ? "text-emerald-500 hover:bg-emerald-50 border-emerald-100" 
                              : "text-slate-300 hover:bg-slate-50 border-slate-100"
                          )}
                          title={product.isActive !== false ? "Visible en Catálogo" : "Oculto en Catálogo"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onEditProduct(product)}
                          className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 shadow-sm border border-slate-100 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-2.5 bg-white hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 shadow-sm border border-slate-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className={cn("flex-1 min-w-0", !isList && "mb-8")}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate",
                            isList ? "text-lg" : "text-2xl",
                            product.isActive === false && "opacity-50 line-through text-slate-400"
                          )}>{product.name}</h3>
                          {product.isActive === false && (
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full">OCULTO</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                           <Badge variant="blue" className={isList ? "py-0 px-2 text-[8px]" : ""}>
                            Receta: {recipe?.name || 'No asignada'}
                          </Badge>
                        </div>
                        {product.description && !isList && (
                          <p className="text-[10px] font-medium text-slate-500 mt-3 line-clamp-2 italic">
                            {product.description}
                          </p>
                        )}
                      </div>
                      {isList && (
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => onToggleVisibility?.(product.id)}
                            className={cn(
                              "p-2 bg-white rounded-lg shadow-sm border transition-all",
                              product.isActive !== false 
                                ? "text-emerald-500 hover:bg-emerald-50 border-emerald-100" 
                                : "text-slate-300 hover:bg-slate-50 border-slate-100"
                            )}
                            title={product.isActive !== false ? "Visible en Catálogo" : "Oculto en Catálogo"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onEditProduct(product)}
                            className="p-2 bg-white hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary-600 shadow-sm border border-slate-100 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-2 bg-white hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 shadow-sm border border-slate-100 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={cn(
                    "flex-1",
                    isList ? "flex flex-wrap gap-3" : "space-y-4"
                  )}>
                    {product.saleFormats.map((format, fIdx) => {
                      const costInfo = getProductCost(product, format.name);
                      const cost = costInfo.total;
                      const margin = format.price > 0 ? ((format.price - cost) / format.price) * 100 : 0;
                      
                      return (
                        <div 
                          key={fIdx} 
                          className={cn(
                            "bg-slate-50/50 hover:bg-white rounded-2xl flex items-center justify-between group/format hover:shadow-lg hover:shadow-slate-200/40 transition-all border border-transparent hover:border-slate-100",
                            isList ? "p-3 px-4 min-w-[150px] flex-1" : "p-5"
                          )}
                        >
                          <div className={isList ? "space-y-0.5" : "space-y-1"}>
                            <p className={cn("font-black text-slate-800", isList ? "text-[11px]" : "text-sm")}>{format.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Costo: {formatCurrency(cost)}</p>
                          </div>
                          <div className="text-right space-y-0.5 ml-4">
                            <p className={cn("font-black text-blue-600 tabular-nums", isList ? "text-sm" : "text-lg")}>{formatCurrency(format.price)}</p>
                            <Badge variant={margin >= 30 ? 'emerald' : 'amber'} className="py-0 px-1.5 text-[8px]">
                              {margin.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="py-24 text-center border-none shadow-sm" delay={0.2}>
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
              <Cake size={48} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">No hay productos configurados</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
                Define tus formatos de venta y<br/>calcula tus márgenes automáticamente.
              </p>
            </div>
            <Button onClick={onAddProduct} variant="primary" size="lg" icon={Plus}>
              Crear Nueva Presentación
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
});
