import React from 'react';
import {
  Plus, ChefHat, Search, Trash2, Mic, Upload,
  BookOpen, LayoutGrid, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';
import { RecipeCard } from './RecipeCard';
import { cn } from '../../lib/utils';
import { Recipe, Supply, AppSettings, Equipment, IngredientMapping } from '../../types';
import Fuse from 'fuse.js';
import { BookView } from './BookView';

interface RecipesViewProps {
  recipes: Recipe[];
  onUpdateRecipes?: (recipes: Recipe[]) => void;
  supplies: Supply[];
  equipment: Equipment[];
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
  onVoiceImport: () => void;
  onExcelImport: () => void;
  onImportIA: () => void;
  onAddSupply?: (s: Supply) => void;
  ingredientMappings?: IngredientMapping[];
  onRegisterMappings?: (mappings: IngredientMapping[]) => void;
}

export const RecipesView = React.memo<RecipesViewProps>(({
  recipes,
  onUpdateRecipes,
  supplies,
  equipment,
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
  settings,
  onVoiceImport,
  onExcelImport,
  onImportIA,
  onAddSupply,
  ingredientMappings,
  onRegisterMappings
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'book'>('book');

  const [localSearch, setLocalSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(localSearch || globalSearch);
    }, 150);
    return () => clearTimeout(handler);
  }, [localSearch, globalSearch]);

  const fuse = React.useMemo(() => {
    return new Fuse(recipes, {
      keys: ['name'],
      threshold: 0.35,
      distance: 100,
      ignoreLocation: true
    });
  }, [recipes]);

  const sortedRecipes = React.useMemo(() => {
    return [...recipes].sort((a, b) => {
      const idxA = a.orderIndex !== undefined ? a.orderIndex : 9999;
      const idxB = b.orderIndex !== undefined ? b.orderIndex : 9999;
      if (idxA !== idxB) return idxA - idxB;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [recipes]);

  React.useEffect(() => {
    setLocalSearch('');
  }, [globalSearch]);

  const filteredRecipes = React.useMemo(() => {
    let result = sortedRecipes;
    const searchTerm = debouncedSearch.trim();
    const isSearching = searchTerm !== '';

    if (isSearching) {
      result = fuse.search(searchTerm).map(res => res.item);
    }

    return result.filter(r => r.type === recipeSubTab);
  }, [sortedRecipes, debouncedSearch, recipeSubTab, fuse]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800 flex items-center gap-3">
            <ChefHat className="w-10 h-10 text-rose-500" />
            Recetario Abierto
          </h2>
          <p className="text-slate-500 font-medium mt-1">Navega tus fórmulas originales, vincula ingredientes y cotiza tus costos al instante.</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('book')}
              className={cn(
                "p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold",
                viewMode === 'book' ? "bg-white text-rose-600 shadow" : "text-slate-400 hover:text-slate-600"
              )}
              title="Ver como Libro Abierto"
            >
              <BookOpen className="w-4 h-4" />
              Libro
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold",
                viewMode === 'grid' ? "bg-white text-rose-600 shadow" : "text-slate-400 hover:text-slate-600"
              )}
              title="Ver como Cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
              Cuadrícula
            </button>
          </div>

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
            variant="secondary"
            onClick={onImportIA}
            icon={Sparkles}
            className="group"
          >
            Importar con IA
          </Button>
          <Button
            variant="secondary"
            onClick={onVoiceImport}
            icon={Mic}
            className="group"
          >
            Dictar Receta
          </Button>
          <Button
            variant="secondary"
            onClick={onExcelImport}
            icon={Upload}
            className="group"
          >
            Importar Excel
          </Button>
          <Button
            variant="primary"
            onClick={onAddRecipe}
            icon={Plus}
          >
            Nueva Receta
          </Button>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-fit shadow-inner border border-slate-100/50">
          <button
            onClick={() => setRecipeSubTab('complete')}
            className={cn(
              "px-8 py-2.5 rounded-xl font-black text-xs transition-all uppercase tracking-widest",
              recipeSubTab === 'complete' ? "bg-white text-rose-600 shadow-xl" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Recetas Completas
          </button>
          <button
            onClick={() => setRecipeSubTab('sub')}
            className={cn(
              "px-8 py-2.5 rounded-xl font-black text-xs transition-all uppercase tracking-widest",
              recipeSubTab === 'sub' ? "bg-white text-rose-600 shadow-xl" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Bases y Rellenos
          </button>
        </div>

        <div className="relative flex-1 w-full max-sm:w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar recetas..."
            className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-rose-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Render selected view mode */}
      {viewMode === 'grid' ? (
        filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, idx) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
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
          <NoRecipesFound recipeSubTab={recipeSubTab} onAddRecipe={onAddRecipe} />
        )
      ) : (
        <BookView
          recipes={recipes}
          filteredRecipes={filteredRecipes}
          recipeSubTab={recipeSubTab}
          supplies={supplies}
          equipment={equipment}
          settings={settings}
          ingredientMappings={ingredientMappings}
          onRegisterMappings={onRegisterMappings}
          onEditRecipe={onEditRecipe}
          onDeleteRecipe={onDeleteRecipe}
          onDuplicateRecipe={onDuplicateRecipe}
          onUpdateRecipes={onUpdateRecipes}
          onAddSupply={onAddSupply}
          getRecipeCost={getRecipeCost}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
});

// ─── Empty State ───

const NoRecipesFound: React.FC<{ recipeSubTab: 'complete' | 'sub'; onAddRecipe: () => void }> = ({ recipeSubTab, onAddRecipe }) => (
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
);
