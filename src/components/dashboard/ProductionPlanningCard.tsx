import React, { useMemo } from 'react';
import { ChefHat, ShoppingBasket, ChevronRight, PackageCheck } from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { Order, Recipe, Product, Supply } from '../../types';
import { cn } from '../../lib/utils';

interface ProductionPlanningCardProps {
  orders: Order[];
  recipes: Recipe[];
  products: Product[];
  supplies: Supply[];
  setActiveTab: (tab: string) => void;
}

export const ProductionPlanningCard: React.FC<ProductionPlanningCardProps> = ({
  orders,
  recipes,
  products,
  supplies,
  setActiveTab
}) => {
  const needs = useMemo(() => {
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
    const ingredientSum: Record<string, { quantity: number; unit: string; name: string }> = {};

    const processRecipe = (recipeId: string, multiplier: number) => {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;

      const yieldVal = recipe.yield || 1;
      const baseMultiplier = multiplier / yieldVal;

      (recipe.ingredients || []).forEach(ing => {
        if (ing.supplyId) {
          const supply = supplies.find(s => s.id === ing.supplyId);
          if (supply) {
            if (!ingredientSum[supply.id]) {
              ingredientSum[supply.id] = { quantity: 0, unit: supply.unit, name: supply.name };
            }
            const quantityToAdd = ing.isFixed 
              ? ing.quantity // Fixed: ignore multiplier
              : (ing.quantity * baseMultiplier); // Variable: scale
            
            ingredientSum[supply.id].quantity += quantityToAdd;
          }
        } else if (ing.recipeId) {
          processRecipe(ing.recipeId, ing.quantity * baseMultiplier);
        }
      });
    };

    activeOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product && product.recipeId) {
          const format = product.saleFormats.find(f => f.name === item.formatName);
          const formatMultiplier = format ? format.multiplier : 1;
          processRecipe(product.recipeId, formatMultiplier * item.quantity);
        }
      });
    });

    return Object.values(ingredientSum).sort((a, b) => b.quantity - a.quantity).slice(0, 6);
  }, [orders, recipes, products, supplies]);

  if (needs.length === 0) return null;

  return (
    <GlassCard className="p-8 border-none shadow-sm flex flex-col h-full" delay={0.7}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
            <ShoppingBasket className="text-rose-500" size={24} />
            Preparación Necesaria
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total de insumos para pedidos activos</p>
        </div>
        <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
          Próximas Entregas
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {needs.map((item, idx) => {
          const supply = supplies.find(s => s.name === item.name);
          const isLow = supply && supply.stock < item.quantity;

          return (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-1.5 h-8 rounded-full transition-all group-hover:h-10",
                  isLow ? "bg-amber-400" : "bg-slate-200 group-hover:bg-rose-400"
                )} />
                <div>
                  <p className="text-sm font-black text-slate-700">{item.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {item.quantity.toFixed(2)} {item.unit} necesarios
                  </p>
                </div>
              </div>
              {isLow && (
                <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-tighter">
                  Stock Insuficiente
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => setActiveTab('inventory')}
        className="w-full mt-8 py-4 text-xs font-black text-slate-400 hover:text-rose-600 bg-slate-50/50 hover:bg-rose-50 rounded-2xl transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2 group"
      >
        Ir al Inventario
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </GlassCard>
  );
};
