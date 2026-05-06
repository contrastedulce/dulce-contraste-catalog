import React from 'react';
import { 
  Calculator, 
  Scale, 
  Plus 
} from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { Supply, Recipe } from '../../types';

interface ToolkitViewProps {
  recipes: Recipe[];
  supplies: Supply[];
  recipeScaler: any;
  setRecipeScaler: (scaler: any) => void;
  unitConverter: any;
  setUnitConverter: (converter: any) => void;
  safeNum: (val: any) => number;
}

export const ToolkitView = React.memo<ToolkitViewProps>(({
  recipes,
  supplies,
  recipeScaler,
  setRecipeScaler,
  unitConverter,
  setUnitConverter,
  safeNum
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800 uppercase">Herramientas</h2>
          <p className="text-slate-500 font-medium mt-1">Herramientas inteligentes para el día a día del Chef.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-10 border-none shadow-sm" delay={0.1}>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Escalador</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Ajuste de rendimientos</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Receta Base</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50/50 border-none rounded-2xl font-black text-slate-700 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none"
                  onChange={(e) => {
                    const recipe = recipes.find(r => r.id === e.target.value);
                    if (recipe) {
                      setRecipeScaler({ ...recipeScaler, originalYield: recipe.yield, targetYield: recipe.yield, ingredients: recipe.ingredients });
                    }
                  }}
                >
                  <option value="">Seleccionar receta...</option>
                  {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Rendimiento Objetivo</label>
                <input 
                  type="number" 
                  value={recipeScaler.targetYield}
                  onChange={(e) => setRecipeScaler({ ...recipeScaler, targetYield: safeNum(e.target.value) })}
                  className="w-full px-5 py-4 bg-slate-50/50 border-none rounded-2xl font-black text-slate-700 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>
            </div>

            {recipeScaler.ingredients.length > 0 && (
              <div className="bg-slate-50/30 rounded-3xl p-8 border border-slate-100/50 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Ingredientes Escalados</p>
                {recipeScaler.ingredients.map((ing: any, idx: number) => {
                  const factor = recipeScaler.targetYield / (recipeScaler.originalYield || 1);
                  const scaledQty = (ing.quantity || 0) * factor;
                  const supply = supplies.find(s => s.id === ing.supplyId);
                  const subRecipe = recipes.find(r => r.id === ing.recipeId);
                  const name = supply?.name || subRecipe?.name || ing.name;
                  const unit = supply?.unit || subRecipe?.yieldUnit || 'un';

                  return (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-100/50 last:border-0 group/row">
                      <span className="font-black text-slate-700 group-hover:text-primary-600 transition-colors uppercase text-xs">{name}</span>
                      <span className="font-black text-primary-600 tabular-nums bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">{scaledQty.toFixed(2)} <span className="text-[10px] opacity-40">{unit}</span></span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-10 border-none shadow-sm" delay={0.2}>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Conversor</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Unidades de medida</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Valor</label>
                <input 
                  type="number" 
                  value={unitConverter.value}
                  onChange={(e) => setUnitConverter({ ...unitConverter, value: safeNum(e.target.value) })}
                  className="w-full px-5 py-4 bg-slate-50/50 border-none rounded-2xl font-black text-slate-700 focus:ring-2 focus:ring-primary-500/20 transition-all text-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">De</label>
                  <select 
                    value={unitConverter.from}
                    onChange={(e) => setUnitConverter({ ...unitConverter, from: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50/50 border-none rounded-2xl font-black text-slate-700 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none"
                  >
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="g">Gramos (g)</option>
                    <option value="l">Litros (l)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="taza">Tazas</option>
                    <option value="cda">Cucharadas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">A</label>
                  <select 
                    value={unitConverter.to}
                    onChange={(e) => setUnitConverter({ ...unitConverter, to: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50/50 border-none rounded-2xl font-black text-slate-700 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none"
                  >
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="g">Gramos (g)</option>
                    <option value="l">Litros (l)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="taza">Tazas</option>
                    <option value="cda">Cucharadas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-10 bg-linear-to-br from-primary-500 to-primary-600 rounded-4xl text-center shadow-xl shadow-primary-600/20 relative overflow-hidden group">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 relative z-10">Resultado Estimado</p>
              <p className="text-5xl font-black text-white tabular-nums relative z-10">
                {(unitConverter.value * (
                  unitConverter.from === 'kg' && unitConverter.to === 'g' ? 1000 :
                  unitConverter.from === 'g' && unitConverter.to === 'kg' ? 0.001 :
                  unitConverter.from === 'l' && unitConverter.to === 'ml' ? 1000 :
                  unitConverter.from === 'ml' && unitConverter.to === 'l' ? 0.001 :
                  unitConverter.from === 'taza' && unitConverter.to === 'ml' ? 250 :
                  unitConverter.from === 'ml' && unitConverter.to === 'taza' ? 1/250 :
                  1
                )).toFixed(2)} <span className="text-2xl opacity-60 ml-1">{unitConverter.to}</span>
              </p>
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
});
