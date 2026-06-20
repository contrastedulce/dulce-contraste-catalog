import React from 'react';
import { Plus, Trash2, Sparkles, ChefHat, Clock, Zap, Box, Calculator, Info, Anchor } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Recipe, Supply, Equipment } from '../../types';
import { SearchableSelect } from '../shared/SearchableSelect';

interface RecipeFormProps {
  recipeFormData: Partial<Recipe>;
  setRecipeFormData: (data: any) => void;
  supplies: Supply[];
  recipes: Recipe[];
  equipment: Equipment[];
  onSave: () => void;
  onQuickCreateSupply?: (name: string, idx: number) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  recipeFormData,
  setRecipeFormData,
  supplies,
  recipes,
  equipment,
  onSave,
  onQuickCreateSupply
}) => {
  const safeNum = (val: any) => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    return parseFloat(String(val).replace(/[^0-9.-]/g, '')) || 0;
  };

  const handleIngredientChange = (idx: number, field: string, value: any) => {
    const newIngs = [...(recipeFormData.ingredients || [])];
    newIngs[idx] = { ...newIngs[idx], [field]: value };
    setRecipeFormData({ ...recipeFormData, ingredients: newIngs });
  };

  const addIngredient = () => {
    const newIngs = [...(recipeFormData.ingredients || []), { quantity: 0 }];
    setRecipeFormData({ ...recipeFormData, ingredients: newIngs });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre de la Receta</label>
        <input
          type="text"
          value={recipeFormData?.name || ''}
          onChange={(e) => setRecipeFormData({ ...recipeFormData, name: e.target.value })}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Uso en Catálogo (Crea tu Torta)</label>
          <select
            value={recipeFormData.catalogCategory || 'Ninguno'}
            onChange={(e) => setRecipeFormData({ ...recipeFormData, catalogCategory: e.target.value as any })}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all font-bold"
          >
            <option value="Ninguno">No mostrar en "Crea tu Torta"</option>
            <option value="Base">Como Base (Bizcocho)</option>
            <option value="Relleno">Como Relleno</option>
            <option value="Cubierta">Como Cubierta (Frosting/Fudge)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipo de Costeo</label>
          <select
            value={recipeFormData.type}
            onChange={(e) => setRecipeFormData({ ...recipeFormData, type: e.target.value as 'sub' | 'complete' })}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all font-bold"
          >
            <option value="complete">Completa</option>
            <option value="sub">Sub-receta</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rendimiento</label>
            <input
              type="number"
              value={recipeFormData.yield}
              onChange={(e) => setRecipeFormData({ ...recipeFormData, yield: parseFloat(e.target.value) })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all text-center font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unidad</label>
            <input
              type="text"
              value={recipeFormData.yieldUnit}
              placeholder="un, gr, kg..."
              onChange={(e) => setRecipeFormData({ ...recipeFormData, yieldUnit: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all text-center"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Insumos e Ingredientes</label>
          <button 
            onClick={addIngredient}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Agregar Insumo</span>
          </button>
        </div>

        <div className="space-y-3">
          {(recipeFormData.ingredients || []).map((ing, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 items-start bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <div className="col-span-8 flex gap-2 items-start">
                <div className="flex-1">
                  <SearchableSelect
                    options={[
                      ...supplies.map(s => ({ id: s.id, name: s.name, group: 'Insumos' })),
                      ...recipes.filter(r => r.id !== recipeFormData.id).map(r => ({ id: r.id, name: r.name, group: 'Sub-recetas' }))
                    ]}
                    value={ing.supplyId || ing.recipeId || ''}
                    onChange={(id) => {
                      const isRecipe = recipes.some(r => r.id === id);
                      const newIngs = [...(recipeFormData.ingredients || [])];
                      if (isRecipe) {
                        newIngs[idx] = { ...newIngs[idx], recipeId: id, supplyId: undefined };
                      } else {
                        newIngs[idx] = { ...newIngs[idx], supplyId: id, recipeId: undefined };
                      }
                      setRecipeFormData({ ...recipeFormData, ingredients: newIngs });
                    }}
                    onAddNew={(name) => onQuickCreateSupply?.(name, idx)}
                    placeholder="Seleccionar insumo o receta..."
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleIngredientChange(idx, 'isFixed', !ing.isFixed);
                  }}
                  className={cn(
                    "mt-2 p-2 rounded-lg transition-all border",
                    ing.isFixed 
                      ? "bg-amber-100 border-amber-200 text-amber-700 shadow-sm" 
                      : "bg-white border-gray-100 text-gray-300 hover:text-gray-500"
                  )}
                  title={ing.isFixed ? "Costo Fijo (No se multiplica)" : "Costo Variable (Se escala)"}
                >
                  <Anchor className={cn("w-4 h-4", ing.isFixed && "animate-pulse")} />
                </button>
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(idx, 'quantity', parseFloat(e.target.value))}
                  placeholder="Cant."
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-center font-bold"
                />
              </div>
              <div className="col-span-1 pt-3">
                <button 
                  onClick={() => {
                    const newIngs = [...(recipeFormData.ingredients || [])];
                    newIngs.splice(idx, 1);
                    setRecipeFormData({ ...recipeFormData, ingredients: newIngs });
                  }}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 pb-2">
          <Clock className="w-4 h-4 text-primary" />
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tiempos de Mano de Obra (Minutos)</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Pesado / Masa</label>
            <input
              type="number"
              value={recipeFormData.laborMinutes?.heavy || 0}
              onChange={(e) => setRecipeFormData({ 
                ...recipeFormData, 
                laborMinutes: { ...(recipeFormData.laborMinutes || {heavy:0, light:0}), heavy: parseFloat(e.target.value) || 0 } 
              })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Horneado / Dec.</label>
            <input
              type="number"
              value={recipeFormData.laborMinutes?.light || 0}
              onChange={(e) => setRecipeFormData({ 
                ...recipeFormData, 
                laborMinutes: { ...(recipeFormData.laborMinutes || {heavy:0, light:0}), light: parseFloat(e.target.value) || 0 } 
              })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 pb-2">
          <Zap className="w-4 h-4 text-primary" />
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Métricas de Servicios (Minutos/Monto)</label>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Luz (Min.)</label>
            <input
              type="number"
              value={recipeFormData.serviceMinutes?.electricity || 0}
              onChange={(e) => setRecipeFormData({ 
                ...recipeFormData, 
                serviceMinutes: { ...(recipeFormData.serviceMinutes || {electricity:0, water:0, gas:0, machinery:0, utensils:0}), electricity: parseFloat(e.target.value) || 0 } 
              })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Agua (Min.)</label>
            <input
              type="number"
              value={recipeFormData.serviceMinutes?.water || 0}
              onChange={(e) => setRecipeFormData({ 
                ...recipeFormData, 
                serviceMinutes: { ...(recipeFormData.serviceMinutes || {electricity:0, water:0, gas:0, machinery:0, utensils:0}), water: parseFloat(e.target.value) || 0 } 
              })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Gas (Min.)</label>
            <input
              type="number"
              value={recipeFormData.serviceMinutes?.gas || 0}
              onChange={(e) => setRecipeFormData({ 
                ...recipeFormData, 
                serviceMinutes: { ...(recipeFormData.serviceMinutes || {electricity:0, water:0, gas:0, machinery:0, utensils:0}), gas: parseFloat(e.target.value) || 0 } 
              })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Deprec. Maq.</label>
            <input
              type="number"
              value={recipeFormData.serviceMinutes?.machinery || 0}
              onChange={(e) => setRecipeFormData({ 
                ...recipeFormData, 
                serviceMinutes: { ...(recipeFormData.serviceMinutes || {electricity:0, water:0, gas:0, machinery:0, utensils:0}), machinery: parseFloat(e.target.value) || 0 } 
              })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Utensilios</label>
            <input
              type="number"
              value={recipeFormData.serviceMinutes?.utensils || 0}
              onChange={(e) => setRecipeFormData({ 
                ...recipeFormData, 
                serviceMinutes: { ...(recipeFormData.serviceMinutes || {electricity:0, water:0, gas:0, machinery:0, utensils:0}), utensils: parseFloat(e.target.value) || 0 } 
              })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100 mb-6">
        <div className="flex items-center gap-2 pb-2">
          <Box className="w-4 h-4 text-primary" />
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Costos Extras (Moneda)</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Bioseguridad</label>
            <input
              type="number"
              value={recipeFormData.extraCosts?.biosecurity || 0}
              onChange={(e) => setRecipeFormData({ 
                ...recipeFormData, 
                extraCosts: { ...(recipeFormData.extraCosts || {biosecurity:0, packaging:0}), biosecurity: parseFloat(e.target.value) || 0 } 
              })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Empaques / Cajas</label>
            <input
              type="number"
              value={recipeFormData.extraCosts?.packaging || 0}
              onChange={(e) => setRecipeFormData({ 
                ...recipeFormData, 
                extraCosts: { ...(recipeFormData.extraCosts || {biosecurity:0, packaging:0}), packaging: parseFloat(e.target.value) || 0 } 
              })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex gap-4 items-start">
        <div className="mt-1 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <Calculator className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-emerald-800">¿Deseas obviar los tiempos? (Regla del x3)</h4>
          <p className="text-xs text-emerald-600/80 leading-relaxed max-w-sm">
            Puedes dejar los tiempos y servicios en 0. Al crear un <b>Producto</b> desde esta receta, el precio de venta sugerido utilizará un multiplicador automático basado en el costo de los ingredientes para garantizar tu rentabilidad.
          </p>
        </div>
      </div>


      <button
        onClick={onSave}
        className="w-full py-4 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all shadow-lg active:scale-[0.98] uppercase tracking-wider"
      >
        Guardar Receta
      </button>
    </div>
  );
};
