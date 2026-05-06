import React from 'react';
import { Plus, ChefHat, Search, Filter, ClipboardList, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { RecipeCard } from './RecipeCard';
import { cn } from '../../lib/utils';
import { Recipe, Supply, AppSettings } from '../../types';

interface RecipesViewProps {
  recipes: Recipe[];
  supplies: Supply[];
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
  recipeSubTab: 'complete' | 'sub';
  setRecipeSubTab: (tab: 'complete' | 'sub') => void;
  selectedRecipes: string[];
  onToggleSelection: (id: string) => void;
  onAddRecipe: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onDuplicateRecipe: (recipe: Recipe) => void;
  onDeleteBulk: () => void;
  getRecipeCost: (recipe: Recipe) => number;
  formatCurrency: (amount: number) => string;
  settings: AppSettings;
}

export const RecipesView = React.memo<RecipesViewProps>(({
  recipes,
  supplies,
  globalSearch,
  setGlobalSearch,
  recipeSubTab,
  setRecipeSubTab,
  selectedRecipes,
  onToggleSelection,
  onAddRecipe,
  onEditRecipe,
  onDeleteRecipe,
  onDuplicateRecipe,
  onDeleteBulk,
  getRecipeCost,
  formatCurrency,
  settings
}) => {
  const filteredRecipes = recipes.filter(r => 
    (r.name || '').toLowerCase().includes(globalSearch.toLowerCase()) &&
    r.type === recipeSubTab
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Recetario</h2>
          <p className="text-slate-500 font-medium mt-1">Gestión de fórmulas magistrales, sub-recetas y cálculo de costos base.</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {selectedRecipes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Button 
                  variant="danger" 
                  onClick={onDeleteBulk}
                  icon={Trash2}
                >
                  Eliminar ({selectedRecipes.length})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            variant="primary" 
            onClick={onAddRecipe}
            icon={Plus}
          >
            Nueva Receta
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-fit shadow-inner border border-slate-100/50">
          <button 
            onClick={() => setRecipeSubTab('complete')}
            className={cn(
              "px-8 py-2.5 rounded-xl font-black text-xs transition-all uppercase tracking-widest",
              recipeSubTab === 'complete' ? "bg-white text-rose-600 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Recetas Completas
          </button>
          <button 
            onClick={() => setRecipeSubTab('sub')}
            className={cn(
              "px-8 py-2.5 rounded-xl font-black text-xs transition-all uppercase tracking-widest",
              recipeSubTab === 'sub' ? "bg-white text-rose-600 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Bases y Rellenos
          </button>
        </div>

        <div className="relative flex-1 w-full max-sm:w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input 
            type="text" 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Buscar recetas..." 
            className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-rose-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300"
          />
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe, idx) => (
            <RecipeCard 
              key={recipe.id}
              recipe={recipe}
              supplies={supplies}
              recipes={recipes}
              isSelected={selectedRecipes.includes(recipe.id)}
              onToggleSelect={() => onToggleSelection(recipe.id)}
              onEdit={() => onEditRecipe(recipe)}
              onDelete={() => onDeleteRecipe(recipe.id)}
              onDuplicate={() => onDuplicateRecipe(recipe)}
              getRecipeCost={getRecipeCost}
              formatCurrency={formatCurrency}
              settings={settings}
              delay={idx * 0.05}
            />
          ))}
        </div>
      ) : (
        <GlassCard className="py-24 text-center border-none shadow-sm" delay={0.2}>
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
              <ChefHat size={48} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">No hay recetas en esta categoría</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
                Empieza creando tu primera {recipeSubTab === 'complete' ? 'receta completa' : 'base o relleno'}<br/>para automatizar tus costos.
              </p>
            </div>
            <Button onClick={onAddRecipe} variant="primary" size="lg" icon={Plus}>
              Crear Receta
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
});
