import React, { useMemo } from 'react';
import { ShoppingBasket, Copy, CheckCircle2, AlertTriangle, XCircle, Package } from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { Order, Product, Recipe, Supply } from '../../types';
import { motion } from 'motion/react';

interface ShoppingListViewProps {
  orders: Order[];
  products: Product[];
  recipes: Recipe[];
  supplies: Supply[];
  formatCurrency: (amount: number) => string;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  orders,
  products,
  recipes,
  supplies,
  formatCurrency
}) => {
  const shoppingList = useMemo(() => {
    const needed = new Map<string, number>();
    
    // 1. Filter active orders
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
    
    // 2. Explode ingredients
    activeOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product || !product.recipeId) return;
        
        const recipe = recipes.find(r => r.id === product.recipeId);
        if (!recipe) return;
        
        // Calculate multipliers
        const format = product.saleFormats.find(f => f.name === item.formatName);
        const formatMultiplier = format ? format.multiplier : 1;
        const totalUnits = item.quantity * formatMultiplier;
        const yieldAdj = totalUnits / (recipe.yield || 1);
        
        // Add ingredients
        recipe.ingredients.forEach(ing => {
          if (ing.supplyId) {
            const current = needed.get(ing.supplyId) || 0;
            needed.set(ing.supplyId, current + (ing.quantity * yieldAdj));
          }
        });

        // Add extra supplies from format
        if (format?.extraSupplies) {
          format.extraSupplies.forEach(ex => {
            const current = needed.get(ex.supplyId) || 0;
            needed.set(ex.supplyId, current + (ex.quantity * item.quantity));
          });
        }
      });
    });
    
    // 3. Map to final list with stock status
    return Array.from(needed.entries()).map(([supplyId, amountNeeded]) => {
      const supply = supplies.find(s => s.id === supplyId);
      const stock = supply ? supply.stock : 0;
      const diff = amountNeeded - stock;
      
      return {
        id: supplyId,
        name: supply ? supply.name : 'Desconocido',
        unit: supply ? supply.unit : '',
        needed: amountNeeded,
        stock: stock,
        toBuy: diff > 0 ? diff : 0,
        status: diff > 0 ? 'out' : (stock < amountNeeded * 1.2 ? 'warning' : 'ok')
      };
    }).sort((a, b) => (b.toBuy > 0 ? 1 : -1));
  }, [orders, products, recipes, supplies]);

  const handleCopy = () => {
    const text = shoppingList
      .filter(item => item.toBuy > 0)
      .map(item => `- ${item.name}: ${item.toBuy.toFixed(2)} ${item.unit}`)
      .join('\n');
    
    navigator.clipboard.writeText(`🛒 *LISTA DE COMPRAS - DULCE CONTRASTE*\n\n${text || '¡Todo en orden! No falta nada.'}`);
    alert('¡Lista copiada al portapapeles!');
  };

  const totals = {
    missing: shoppingList.filter(i => i.toBuy > 0).length,
    ok: shoppingList.filter(i => i.toBuy === 0).length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="bg-rose-500 p-2.5 rounded-2xl shadow-lg shadow-rose-200">
              <ShoppingBasket className="text-white" size={28} />
            </div>
            Lista de Compras Inteligente
          </h2>
          <p className="text-slate-500 font-medium mt-1">Calculado en base a tus pedidos pendientes y en preparación.</p>
        </div>

        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          <Copy size={16} />
          Copiar para WhatsApp
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 flex items-center gap-4 bg-rose-50/50 border-rose-100">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Insumos Faltantes</p>
            <p className="text-2xl font-black text-rose-600">{totals.missing}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-4 bg-emerald-50/50 border-emerald-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Insumos con Stock</p>
            <p className="text-2xl font-black text-emerald-600">{totals.ok}</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {shoppingList.length > 0 ? shoppingList.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <GlassCard className={cn(
              "p-4 border-none shadow-sm flex items-center justify-between gap-4",
              item.toBuy > 0 ? "bg-white border-l-4 border-l-rose-500" : "bg-white/60 opacity-60"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  item.toBuy > 0 ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-400"
                )}>
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Stock: {item.stock.toFixed(1)} / Necesitas: {item.needed.toFixed(1)} {item.unit}
                  </p>
                </div>
              </div>

              {item.toBuy > 0 ? (
                <div className="text-right">
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-0.5">Comprar</p>
                  <p className="text-xl font-black text-rose-600">+{item.toBuy.toFixed(1)} <span className="text-xs uppercase">{item.unit}</span></p>
                </div>
              ) : (
                <CheckCircle2 className="text-emerald-500" size={24} />
              )}
            </GlassCard>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
              <ShoppingBasket size={40} />
            </div>
            <h3 className="text-lg font-black text-slate-800">No hay pedidos pendientes</h3>
            <p className="text-slate-400 font-bold mt-2">La lista se genera automáticamente cuando registras pedidos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
