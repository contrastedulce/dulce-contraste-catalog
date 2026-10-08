import React from 'react';
import {
  ChefHat, BookOpen, ChevronLeft, ChevronRight, ChevronDown,
  ArrowUp, ArrowDown, Calculator, Box, Book, FileText, Trash2, Plus,
  Copy, Pencil
} from 'lucide-react';
import { cn, getProfessorColor } from '../../lib/utils';
import { getRecipeBreakdown } from '../../lib/costing';
import { Recipe, Supply, AppSettings, Equipment, IngredientMapping } from '../../types';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { SearchableSelect } from '../shared/SearchableSelect';
import { RecipeForm } from './RecipeForm';

interface BookViewProps {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  recipeSubTab: 'complete' | 'sub';
  supplies: Supply[];
  equipment: Equipment[];
  settings: AppSettings;
  ingredientMappings?: IngredientMapping[];
  onRegisterMappings?: (mappings: IngredientMapping[]) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onDuplicateRecipe: (recipe: Recipe) => void;
  onUpdateRecipes?: (recipes: Recipe[]) => void;
  onAddSupply?: (s: Supply) => void;
  getRecipeCost: (recipe: Recipe) => number;
  formatCurrency: (amount: number) => string;
}

export const BookView = React.memo<BookViewProps>(({
  recipes,
  filteredRecipes,
  recipeSubTab,
  supplies,
  equipment,
  settings,
  ingredientMappings,
  onRegisterMappings,
  onEditRecipe,
  onDeleteRecipe,
  onDuplicateRecipe,
  onUpdateRecipes,
  onAddSupply,
  getRecipeCost,
  formatCurrency,
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = React.useState<string | null>(null);
  const [isEditingRecipeInline, setIsEditingRecipeInline] = React.useState(false);
  const [inlineRecipeFormData, setInlineRecipeFormData] = React.useState<Partial<Recipe>>({});
  const [bookHeight, setBookHeight] = React.useState(600);
  const bookWrapperRef = React.useRef<HTMLDivElement>(null);

  const [editingIngredientIndex, setEditingIngredientIndex] = React.useState<number | null>(null);
  const [editingIngredientSubRecipeId, setEditingIngredientSubRecipeId] = React.useState<string | null>(null);
  const [editIngQuantity, setEditIngQuantity] = React.useState<number>(0);
  const [editIngSupplyId, setEditIngSupplyId] = React.useState<string | undefined>(undefined);
  const [editIngRecipeId, setEditIngRecipeId] = React.useState<string | undefined>(undefined);
  const [expandedSubRecipes, setExpandedSubRecipes] = React.useState<Record<string, boolean>>({});
  const [isEditingRawText, setIsEditingRawText] = React.useState(false);
  const [editingRawText, setEditingRawText] = React.useState('');


  const handleSaveRawText = () => {
    if (!selectedRecipeId || !onUpdateRecipes) return;
    const updated = recipes.map(r => r.id === selectedRecipeId ? { ...r, rawText: editingRawText } : r);
    onUpdateRecipes(updated);
    setIsEditingRawText(false);
  };

  const startEditRawText = () => {
    const recipe = recipes.find(r => r.id === selectedRecipeId);
    setEditingRawText(recipe?.rawText || '');
    setIsEditingRawText(true);
  };

  const toggleSubRecipe = (id: string) => {
    setExpandedSubRecipes(prev => ({
      ...prev,
      [id]: !(prev[id] ?? true)
    }));
  };

  React.useEffect(() => {
    setIsEditingRecipeInline(false);
  }, [selectedRecipeId]);

  const handleSaveRecipeInline = React.useCallback(() => {
    if (!inlineRecipeFormData.name || !selectedRecipeId) return;

    const newMappings: IngredientMapping[] = [];
    (inlineRecipeFormData.ingredients || []).forEach(ing => {
      if (ing.name && (ing.supplyId || ing.recipeId)) {
        let equivalenceRatio: number | undefined = undefined;
        if (ing.originalQuantity && ing.quantity) {
          equivalenceRatio = ing.quantity / ing.originalQuantity;
        }
        newMappings.push({
          rawName: ing.name.toLowerCase(),
          supplyId: ing.supplyId,
          recipeId: ing.recipeId,
          originalUnit: ing.originalUnit,
          equivalenceRatio
        });
      }
    });
    if (newMappings.length > 0 && onRegisterMappings) {
      onRegisterMappings(newMappings);
    }

    const newSubRecipes = inlineRecipeFormData.generatedSubRecipes || [];

    const recipeData: Recipe = {
      id: selectedRecipeId,
      name: String(inlineRecipeFormData.name!),
      type: inlineRecipeFormData.type || 'complete',
      ingredients: (inlineRecipeFormData.ingredients || []).map(ing => ({
        ...ing,
        quantity: Number(ing.quantity) || 0
      })),
      equipment: (inlineRecipeFormData.equipment || []).map(eq => ({
        ...eq,
        hoursUsed: Number(eq.hoursUsed) || 0
      })),
      laborCost: Number(inlineRecipeFormData.laborCost) || 0,
      laborMinutes: {
        heavy: Number(inlineRecipeFormData.laborMinutes?.heavy) || 0,
        light: Number(inlineRecipeFormData.laborMinutes?.light) || 0
      },
      serviceMinutes: {
        electricity: Number(inlineRecipeFormData.serviceMinutes?.electricity) || 0,
        water: Number(inlineRecipeFormData.serviceMinutes?.water) || 0,
        gas: Number(inlineRecipeFormData.serviceMinutes?.gas) || 0,
        machinery: Number(inlineRecipeFormData.serviceMinutes?.machinery) || 0,
        utensils: Number(inlineRecipeFormData.serviceMinutes?.utensils) || 0
      },
      extraCosts: {
        biosecurity: Number(inlineRecipeFormData.extraCosts?.biosecurity) || 0,
        packaging: Number(inlineRecipeFormData.extraCosts?.packaging) || 0
      },
      yield: Number(inlineRecipeFormData.yield) || 1,
      yieldUnit: String(inlineRecipeFormData.yieldUnit || 'un'),
      rawText: inlineRecipeFormData.rawText,
      instructions: inlineRecipeFormData.instructions || [],
      author: inlineRecipeFormData.author
    };

    if (onUpdateRecipes) {
      const updated = recipes.map(r => r.id === selectedRecipeId ? recipeData : r);
      const finalRecipes = [...newSubRecipes, ...updated];
      onUpdateRecipes(finalRecipes);
    }

    setIsEditingRecipeInline(false);
  }, [inlineRecipeFormData, selectedRecipeId, recipes, onUpdateRecipes, onRegisterMappings]);

  const handleQuickCreateSupplyInline = React.useCallback((name: string, idx: number) => {
    const newSupply: Supply = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      unit: 'un',
      cost: 0,
      category: 'Secos',
      stock: 0,
      minStock: 0
    };
    if (onAddSupply) {
      onAddSupply(newSupply);
    }

    setInlineRecipeFormData(prev => {
      const newIngs = [...(prev.ingredients || [])];
      newIngs[idx] = { ...newIngs[idx], supplyId: newSupply.id, recipeId: undefined, name: undefined };
      return { ...prev, ingredients: newIngs };
    });
  }, [onAddSupply]);

  React.useEffect(() => {
    const el = bookWrapperRef.current;
    if (!el) return;

    const calculateHeight = () => {
      const windowH = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const contentScroll = el.closest('.custom-scrollbar, [class*="overflow-y-auto"]');
      const scrollTop = contentScroll ? contentScroll.scrollTop : 0;
      const topOffset = rect.top + scrollTop;
      const bottomMargin = 28;
      const available = windowH - topOffset - bottomMargin;
      setBookHeight(Math.max(620, Math.min(available, windowH - 140)));
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight, { passive: true });

    // Recalcular cuando cambia el layout (sub-tabs, toolbar, etc.)
    const ro = new ResizeObserver(() => calculateHeight());
    if (el.parentElement) ro.observe(el.parentElement);

    return () => {
      window.removeEventListener('resize', calculateHeight);
      ro.disconnect();
    };
  }, []);

  const moveRecipe = (index: number, direction: 'up' | 'down') => {
    if (!onUpdateRecipes) return;

    const categoryRecipes = [...recipes].sort((a, b) => {
      const idxA = a.orderIndex !== undefined ? a.orderIndex : 9999;
      const idxB = b.orderIndex !== undefined ? b.orderIndex : 9999;
      if (idxA !== idxB) return idxA - idxB;
      return (a.name || '').localeCompare(b.name || '');
    }).filter(r => r.type === recipeSubTab);

    const targetIdx = direction === 'up' ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= categoryRecipes.length) return;

    const temp = categoryRecipes[index];
    categoryRecipes[index] = categoryRecipes[targetIdx];
    categoryRecipes[targetIdx] = temp;

    const updatedRecipes = recipes.map(r => {
      if (r.type === recipeSubTab) {
        const newIdx = categoryRecipes.findIndex(cr => cr.id === r.id);
        return { ...r, orderIndex: newIdx };
      }
      return r;
    });

    onUpdateRecipes(updatedRecipes);
  };

  const selectedRecipe = React.useMemo(() => {
    return recipes.find(r => r.id === selectedRecipeId) || null;
  }, [recipes, selectedRecipeId]);

  const handleSaveMainIngredient = (index: number) => {
    if (!onUpdateRecipes || !selectedRecipe) return;

    const updatedRecipe = { ...selectedRecipe };
    updatedRecipe.ingredients = [...(updatedRecipe.ingredients || [])];

    updatedRecipe.ingredients[index] = {
      ...updatedRecipe.ingredients[index],
      quantity: editIngQuantity,
      supplyId: editIngSupplyId,
      recipeId: editIngRecipeId
    };

    const updatedRecipes = recipes.map(r => r.id === selectedRecipe.id ? updatedRecipe : r);
    onUpdateRecipes(updatedRecipes);
    setEditingIngredientIndex(null);
    setEditingIngredientSubRecipeId(null);
  };

  const handleSaveSubIngredient = (subRecipeId: string, subIngIndex: number) => {
    if (!onUpdateRecipes) return;
    const targetSub = recipes.find(r => r.id === subRecipeId);
    if (!targetSub) return;

    const updatedIngredients = [...(targetSub.ingredients || [])];
    updatedIngredients[subIngIndex] = {
      ...updatedIngredients[subIngIndex],
      quantity: editIngQuantity,
      supplyId: editIngSupplyId,
      recipeId: editIngRecipeId
    };

    const updatedSub = { ...targetSub, ingredients: updatedIngredients };
    const updatedRecipes = recipes.map(r => r.id === subRecipeId ? updatedSub : r);
    onUpdateRecipes(updatedRecipes);
    setEditingIngredientIndex(null);
    setEditingIngredientSubRecipeId(null);
  };

  const categoryRecipes = React.useMemo(() => {
    return filteredRecipes;
  }, [filteredRecipes]);

  const currentIdxInBook = React.useMemo(() => {
    if (!selectedRecipeId) return -1;
    return categoryRecipes.findIndex(r => r.id === selectedRecipeId);
  }, [categoryRecipes, selectedRecipeId]);

  const goToNextPage = () => {
    if (currentIdxInBook < categoryRecipes.length - 1) {
      setSelectedRecipeId(categoryRecipes[currentIdxInBook + 1].id);
    }
  };

  const goToPrevPage = () => {
    if (currentIdxInBook > 0) {
      setSelectedRecipeId(categoryRecipes[currentIdxInBook - 1].id);
    } else {
      setSelectedRecipeId(null);
    }
  };

  const ITEMS_PER_PAGE = 30;
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredRecipes.length, recipeSubTab]);

  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE) || 1;
  const paginatedRecipes = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecipes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecipes, currentPage]);

  const getBreakdown = (recipe: Recipe) =>
    getRecipeBreakdown(recipe, getRecipeCost(recipe), settings.masterCosts);

  const isBlockOpen = (blockId: string) => expandedSubRecipes[blockId] !== false;

  return (
    <div ref={bookWrapperRef} className="relative w-full max-w-none mx-auto">
      {/* Main Shell */}
      <div className="bg-[#5c1d24] p-2.5 sm:p-3 md:p-4 rounded-[28px] shadow-2xl border-4 border-[#3d1217] relative">

        <div
          className="bg-[#fcfaf2] rounded-2xl shadow-inner border border-amber-100/50 flex flex-col overflow-hidden relative"
          style={{ height: `${bookHeight}px` }}
        >

          {/* ── INDEX PAGE (no recipe selected) ── */}
          {!selectedRecipe ? (
            <div className="flex-1 flex flex-col min-h-0 p-5 md:p-8">
              <div className="border-b-2 border-rose-500/20 pb-4 mb-4 shrink-0 flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-serif text-2xl md:text-3xl font-black text-[#5c1d24] tracking-wide">
                    Índice de {recipeSubTab === 'complete' ? 'Recetas Completas' : 'Bases y Rellenos'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                    {filteredRecipes.length} recetas totales · Pág. {currentPage} de {totalPages}
                  </p>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded-lg text-slate-600 hover:bg-white hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                      title="Página anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black text-slate-700 px-2">
                      {currentPage}/{totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded-lg text-slate-600 hover:bg-white hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                      title="Página siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 content-start">
                {paginatedRecipes.map((r, pIdx) => {
                  const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + pIdx;
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white border border-slate-100 hover:border-slate-200/80 transition-all shadow-sm group"
                    >
                      <button
                        onClick={() => setSelectedRecipeId(r.id)}
                        className="flex-1 text-left flex items-center gap-2.5 font-serif text-slate-800 hover:text-rose-600 transition-colors min-w-0"
                      >
                        <span className="font-bold text-rose-500 text-sm font-sans w-6 text-right shrink-0">{globalIdx + 1}.</span>
                        <span className="font-bold text-sm leading-tight truncate">{r.name}</span>
                        {r.pdfPath && (
                          <Badge variant="emerald" className="text-[9px] px-1.5 py-0.5 shrink-0">PDF</Badge>
                        )}
                        {r.author && getProfessorColor(r.author, settings.professorColors) && (
                          <span
                            className="shrink-0 w-2.5 h-2.5 rounded-full border border-white/40"
                            style={{ backgroundColor: getProfessorColor(r.author, settings.professorColors)! }}
                            title={r.author}
                          />
                        )}
                      </button>

                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => moveRecipe(globalIdx, 'up')}
                          disabled={globalIdx === 0}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 disabled:opacity-30"
                          title="Subir posición"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveRecipe(globalIdx, 'down')}
                          disabled={globalIdx === filteredRecipes.length - 1}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 disabled:opacity-30"
                          title="Bajar posición"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredRecipes.length === 0 && (
                  <p className="text-center text-slate-400 italic py-12 col-span-full">No se encontraron recetas.</p>
                )}
              </div>
            </div>

          ) : (
            /* ── RECIPE SELECTED: FULL-WIDTH TABS LAYOUT ── */
            <div className="flex-1 flex flex-col min-h-0">

              {/* Top bar: back button + tabs + actions */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8 space-y-8">
                {/* Back button */}
                <button
                  onClick={() => setSelectedRecipeId(null)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors w-fit"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Volver al Índice
                </button>

                {isEditingRecipeInline ? (
                  <RecipeForm
                    recipeFormData={inlineRecipeFormData}
                    setRecipeFormData={setInlineRecipeFormData}
                    supplies={supplies}
                    recipes={recipes}
                    equipment={equipment}
                    onSave={handleSaveRecipeInline}
                    onQuickCreateSupply={handleQuickCreateSupplyInline}
                    ingredientMappings={ingredientMappings}
                    onRegisterMappings={onRegisterMappings}
                    professorColors={settings.professorColors || []}
                  />
                ) : (
                  <>
                    <RecipeDetailSheet
                      selectedRecipe={selectedRecipe}
                      recipes={recipes}
                      supplies={supplies}
                      expandedSubRecipes={expandedSubRecipes}
                      toggleSubRecipe={toggleSubRecipe}
                      isBlockOpen={isBlockOpen}
                      editingIngredientIndex={editingIngredientIndex}
                      editingIngredientSubRecipeId={editingIngredientSubRecipeId}
                      editIngQuantity={editIngQuantity}
                      editIngSupplyId={editIngSupplyId}
                      editIngRecipeId={editIngRecipeId}
                      setEditingIngredientIndex={setEditingIngredientIndex}
                      setEditingIngredientSubRecipeId={setEditingIngredientSubRecipeId}
                      setEditIngQuantity={setEditIngQuantity}
                      setEditIngSupplyId={setEditIngSupplyId}
                      setEditIngRecipeId={setEditIngRecipeId}
                      handleSaveMainIngredient={handleSaveMainIngredient}
                      handleSaveSubIngredient={handleSaveSubIngredient}
                      onEditRecipe={onEditRecipe}
                      onDeleteRecipe={onDeleteRecipe}
                      onDuplicateRecipe={onDuplicateRecipe}
                      setInlineRecipeFormData={setInlineRecipeFormData}
                      setIsEditingRecipeInline={setIsEditingRecipeInline}
                      setSelectedRecipeId={setSelectedRecipeId}
                      getRecipeCost={getRecipeCost}
                      formatCurrency={formatCurrency}
                      getBreakdown={getBreakdown}
                      settings={settings}
                    />

                    {/* ── RECETA ORIGINAL ── */}
                    <div className="pt-8 border-t border-slate-200/60">
                      {isEditingRawText ? (
                        <div className="flex flex-col min-h-[400px]">
                          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-rose-500/20 shrink-0">
                            <span className="text-[10px] font-sans font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                              ✏️ Pegar / Editar Texto de Receta
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setIsEditingRawText(false)}
                                className="px-3 py-1.5 text-xs font-black text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={handleSaveRawText}
                                className="px-3 py-1.5 text-xs font-black text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-all shadow-sm"
                              >
                                Guardar
                              </button>
                            </div>
                          </div>
                          <textarea
                            value={editingRawText}
                            onChange={(e) => setEditingRawText(e.target.value)}
                            placeholder="Pega aquí el texto de la receta (desde PDF, Word o cualquier fuente)..."
                            className="flex-1 w-full p-4 bg-[#fffdf9] border border-amber-100/60 rounded-xl font-serif text-sm text-slate-800 leading-relaxed resize-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all custom-scrollbar min-h-[300px]"
                          />
                        </div>
                      ) : selectedRecipe.rawText ? (
                        <div className="bg-[#fffdf9] border border-amber-100/60 rounded-2xl shadow-inner overflow-hidden flex flex-col">
                          <div className="shrink-0 border-b-2 border-rose-500/20 px-6 py-3 flex items-center justify-between">
                            <span className="text-[10px] font-sans font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                              📄 Texto de Receta Original
                            </span>
                            <button
                              onClick={startEditRawText}
                              className="text-[10px] font-sans font-black text-slate-400 hover:text-rose-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-all"
                            >
                              <Pencil className="w-3 h-3" />
                              Editar
                            </button>
                          </div>
                          <div className="px-6 md:px-10 py-6 font-serif text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
                            {selectedRecipe.rawText.split('\n').map((line, i) => {
                              const t = line.trim();
                              const esTitulo = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s·]{2,}$/.test(t) && t.length > 3 && !/\d/.test(t);
                              const esSub = t.endsWith(':') && t.length < 70;
                              const bold = esTitulo || esSub;
                              return <div key={i} className={bold ? 'font-bold' : undefined}>{line || '\u00A0'}</div>;
                            })}
                          </div>
                        </div>
                      ) : selectedRecipe.pdfPath ? (
                        <div className="min-h-[600px] rounded-2xl overflow-hidden border border-slate-200/60">
                          <iframe
                            src={`/api/recipes/pdf-file/${encodeURIComponent(selectedRecipe.pdfPath!)}#page=${selectedRecipe.pdfPage || 1}&toolbar=0&navpanes=0`}
                            className="w-full h-full min-h-[600px] border-none"
                            title={`PDF de ${selectedRecipe.name}`}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center space-y-5 select-none py-8">
                          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-100 shadow-sm">
                            <Book className="w-10 h-10" />
                          </div>
                          <div>
                            <h4 className="font-serif text-xl font-black text-slate-800">Sin Texto o PDF asociado</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                              Pega el texto de la receta desde tu PDF o Word
                            </p>
                          </div>
                          <Button variant="primary" size="sm" onClick={startEditRawText} icon={Plus}>
                            Pegar Texto
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Book Navigator */}
        {selectedRecipe && (
          <div className="mt-4 flex items-center justify-between text-white/80 px-2">
            <button
              onClick={goToPrevPage}
              className="flex items-center gap-1 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Pág. Anterior
            </button>

            <span className="text-xs font-black uppercase tracking-widest">
              Fórmula {currentIdxInBook + 1} de {categoryRecipes.length}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentIdxInBook === categoryRecipes.length - 1}
              className="flex items-center gap-1 text-xs font-black uppercase tracking-widest hover:text-white transition-colors disabled:opacity-40"
            >
              Pág. Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});


// ─── Recipe Detail Sheet (right panel when a recipe is selected) ───




// ─── Recipe Detail Sheet (right panel when a recipe is selected) ───

interface RecipeDetailSheetProps {
  selectedRecipe: Recipe;
  recipes: Recipe[];
  supplies: Supply[];
  expandedSubRecipes: Record<string, boolean>;
  toggleSubRecipe: (id: string) => void;
  isBlockOpen: (blockId: string) => boolean;
  editingIngredientIndex: number | null;
  editingIngredientSubRecipeId: string | null;
  editIngQuantity: number;
  editIngSupplyId: string | undefined;
  editIngRecipeId: string | undefined;
  setEditingIngredientIndex: (idx: number | null) => void;
  setEditingIngredientSubRecipeId: (id: string | null) => void;
  setEditIngQuantity: (qty: number) => void;
  setEditIngSupplyId: (id: string | undefined) => void;
  setEditIngRecipeId: (id: string | undefined) => void;
  handleSaveMainIngredient: (index: number) => void;
  handleSaveSubIngredient: (subRecipeId: string, subIngIndex: number) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onDuplicateRecipe: (recipe: Recipe) => void;
  setInlineRecipeFormData: (data: Partial<Recipe>) => void;
  setIsEditingRecipeInline: (editing: boolean) => void;
  setSelectedRecipeId: (id: string | null) => void;
  getRecipeCost: (recipe: Recipe) => number;
  formatCurrency: (amount: number) => string;
  getBreakdown: (recipe: Recipe) => ReturnType<typeof getRecipeBreakdown>;
  settings: AppSettings;
}

const RecipeDetailSheet = React.memo<RecipeDetailSheetProps>(({
  selectedRecipe,
  recipes,
  supplies,
  expandedSubRecipes,
  toggleSubRecipe,
  isBlockOpen,
  editingIngredientIndex,
  editingIngredientSubRecipeId,
  editIngQuantity,
  editIngSupplyId,
  editIngRecipeId,
  setEditingIngredientIndex,
  setEditingIngredientSubRecipeId,
  setEditIngQuantity,
  setEditIngSupplyId,
  setEditIngRecipeId,
  handleSaveMainIngredient,
  handleSaveSubIngredient,
  onEditRecipe,
  onDeleteRecipe,
  onDuplicateRecipe,
  setInlineRecipeFormData,
  setIsEditingRecipeInline,
  setSelectedRecipeId,
  getRecipeCost,
  formatCurrency,
  getBreakdown,
  settings,
}) => {
  return (
    <div className="space-y-8 pb-8">
      <div className="space-y-4">
        {/* Name and Actions */}
        <div className="flex justify-between items-start border-b border-slate-200/60 pb-4 mb-4">
          <div>
            <Badge variant={selectedRecipe.type === 'complete' ? 'emerald' : 'purple'}>
              {selectedRecipe.type === 'complete' ? 'Completa' : 'Base o Relleno'}
            </Badge>
            <h3 className="font-serif text-2xl font-black text-slate-800 leading-tight mt-1">{selectedRecipe.name}</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1">
              <Box className="w-3.5 h-3.5 text-slate-300" />
              Rinde: {selectedRecipe.yield} {selectedRecipe.yieldUnit || 'un'}
            </span>
            {selectedRecipe.author && getProfessorColor(selectedRecipe.author, settings.professorColors) && (
              <span
                className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border mt-2"
                style={{
                  color: getProfessorColor(selectedRecipe.author, settings.professorColors)!,
                  backgroundColor: `${getProfessorColor(selectedRecipe.author, settings.professorColors)}15`,
                  borderColor: `${getProfessorColor(selectedRecipe.author, settings.professorColors)}40`
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: getProfessorColor(selectedRecipe.author, settings.professorColors)! }}
                />
                {selectedRecipe.author}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDuplicateRecipe(selectedRecipe)}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-emerald-600 transition-all shadow-sm"
              title="Duplicar Receta"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setInlineRecipeFormData(selectedRecipe);
                setIsEditingRecipeInline(true);
              }}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-rose-600 transition-all shadow-sm"
              title="Editar Receta"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Estás seguro de eliminar "${selectedRecipe.name}"?`)) {
                  onDeleteRecipe(selectedRecipe.id);
                  setSelectedRecipeId(null);
                }
              }}
              className="p-2 bg-white hover:bg-rose-50 border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 transition-all shadow-sm"
              title="Eliminar Receta"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-recipes & Ingredients Accordion Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 shrink-0">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-rose-500" />
              Desglose de Costos por Sub-receta
            </h4>
            <span className="text-[10px] text-slate-400 font-bold">
              Haz clic para expandir / contraer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
            {(() => {
              const subRecipeIngs = (selectedRecipe.ingredients || []).filter(ing => ing.recipeId);
              const directSupplyIngs = (selectedRecipe.ingredients || []).filter(ing => ing.supplyId);

              return (
                <>
                  {/* Sub-recipes accordions */}
                  {subRecipeIngs.map((ing, ingIdx) => {
                    const subRecipe = recipes.find(r => r.id === ing.recipeId);
                    if (!subRecipe) return null;

                    const blockId = `sub_${subRecipe.id}_${ingIdx}`;
                    const open = isBlockOpen(blockId);
                    const subCost = getRecipeCost(subRecipe);
                    const subYield = subRecipe.yield || 1;
                    const subRecipePortionCost = subCost / subYield;
                    const subTotalCost = subRecipePortionCost * ing.quantity;

                    return (
                      <div key={blockId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                        <div
                          onClick={() => toggleSubRecipe(blockId)}
                          className="p-3.5 bg-slate-50/70 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between select-none transition-colors border-b border-slate-100"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className={cn("p-1 rounded-lg bg-white border border-slate-200 text-slate-500 transition-transform duration-200", open ? "rotate-180" : "rotate-0")}>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-slate-800 truncate">{subRecipe.name}</span>
                            <Badge variant="purple" className="text-[9px] px-2 py-0.5">Sub-receta</Badge>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditRecipe(subRecipe);
                              }}
                              className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-rose-600 transition-colors ml-1.5 shrink-0"
                              title="Editar Sub-receta"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right pl-3">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Subtotal</span>
                            <span className="text-sm font-black text-slate-900 tabular-nums">{formatCurrency(subTotalCost)}</span>
                          </div>
                        </div>

                        {open && (
                          <IngredientTable
                            ingredients={subRecipe.ingredients || []}
                            supplies={supplies}
                            recipes={recipes}
                            getRecipeCost={getRecipeCost}
                            formatCurrency={formatCurrency}
                            parentId={subRecipe.id}
                            editingIngredientIndex={editingIngredientIndex}
                            editingIngredientSubRecipeId={editingIngredientSubRecipeId}
                            editIngQuantity={editIngQuantity}
                            editIngSupplyId={editIngSupplyId}
                            editIngRecipeId={editIngRecipeId}
                            setEditingIngredientIndex={setEditingIngredientIndex}
                            setEditingIngredientSubRecipeId={setEditingIngredientSubRecipeId}
                            setEditIngQuantity={setEditIngQuantity}
                            setEditIngSupplyId={setEditIngSupplyId}
                            setEditIngRecipeId={setEditIngRecipeId}
                            handleSaveIngredient={(idx) => handleSaveSubIngredient(subRecipe.id, idx)}
                            showSubRecipes
                            footerLabel={`Costo Total Sub-receta (${subRecipe.name})`}
                            footerValue={formatCurrency(subCost)}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Direct Insumos Accordion */}
                  {directSupplyIngs.length > 0 && (
                    (() => {
                      const blockId = `direct_${selectedRecipe.id}`;
                      const open = isBlockOpen(blockId);
                      let directTotalCost = 0;

                      directSupplyIngs.forEach(ing => {
                        const supply = supplies.find(s => s.id === ing.supplyId);
                        if (supply) directTotalCost += supply.cost * ing.quantity;
                      });

                      return (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                          <div
                            onClick={() => toggleSubRecipe(blockId)}
                            className="p-3.5 bg-slate-50/70 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between select-none transition-colors border-b border-slate-100"
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className={cn("p-1 rounded-lg bg-white border border-slate-200 text-slate-500 transition-transform duration-200", open ? "rotate-180" : "rotate-0")}>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-sm text-slate-800 truncate">Insumos Directos y Ensamble</span>
                              <Badge variant="emerald" className="text-[9px] px-2 py-0.5">Insumos</Badge>
                            </div>

                            <div className="text-right pl-3">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Subtotal</span>
                              <span className="text-sm font-black text-slate-900 tabular-nums">{formatCurrency(directTotalCost)}</span>
                            </div>
                          </div>

                          {open && (
                            <IngredientTable
                              ingredients={directSupplyIngs}
                              supplies={supplies}
                              recipes={recipes}
                              getRecipeCost={getRecipeCost}
                              formatCurrency={formatCurrency}
                              parentId={null}
                              editingIngredientIndex={editingIngredientIndex}
                              editingIngredientSubRecipeId={editingIngredientSubRecipeId}
                              editIngQuantity={editIngQuantity}
                              editIngSupplyId={editIngSupplyId}
                              editIngRecipeId={editIngRecipeId}
                              setEditingIngredientIndex={setEditingIngredientIndex}
                              setEditingIngredientSubRecipeId={setEditingIngredientSubRecipeId}
                              setEditIngQuantity={setEditIngQuantity}
                              setEditIngSupplyId={setEditIngSupplyId}
                              setEditIngRecipeId={setEditIngRecipeId}
                              handleSaveIngredient={handleSaveMainIngredient}
                              showSubRecipes={false}
                              footerLabel="Costo Total Insumos Directos"
                              footerValue={formatCurrency(directTotalCost)}
                            />
                          )}
                        </div>
                      );
                    })()
                  )}

                  {subRecipeIngs.length === 0 && directSupplyIngs.length === 0 && (
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80">
                      <p className="text-xs text-slate-400 italic">No hay sub-recetas ni ingredientes vinculados a esta receta.</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      {(() => {
        const costs = getBreakdown(selectedRecipe);
        return (
          <div className="space-y-3 border-t border-slate-200/60 pt-3 mt-2 shrink-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Costo Producción</span>
                <span className="text-xl font-black text-slate-800 tabular-nums mt-0.5">{formatCurrency(costs.totalCost)}</span>
              </div>
              <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100/50 flex flex-col justify-center text-right">
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Costo Unitario</span>
                <span className="text-xl font-black text-rose-600 tabular-nums mt-0.5">{formatCurrency(costs.costPerUnit)}</span>
              </div>
            </div>

            <div className="bg-linear-to-r from-rose-500 to-purple-600 p-3.5 rounded-2xl text-white shadow-md flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-100">Precio Sugerido (30% + Imp)</span>
                <div className="text-2xl font-black tabular-nums leading-none">{formatCurrency(costs.suggestedPrice)}</div>
              </div>
              <Calculator className="w-8 h-8 opacity-20" />
            </div>
          </div>
        );
      })()}
    </div>
  );
});

// ─── Ingredient Table (shared between sub-recipes and direct ingredients) ───

interface IngredientTableProps {
  ingredients: Recipe['ingredients'];
  supplies: Supply[];
  recipes: Recipe[];
  getRecipeCost: (recipe: Recipe) => number;
  formatCurrency: (amount: number) => string;
  parentId: string | null;
  editingIngredientIndex: number | null;
  editingIngredientSubRecipeId: string | null;
  editIngQuantity: number;
  editIngSupplyId: string | undefined;
  editIngRecipeId: string | undefined;
  setEditingIngredientIndex: (idx: number | null) => void;
  setEditingIngredientSubRecipeId: (id: string | null) => void;
  setEditIngQuantity: (qty: number) => void;
  setEditIngSupplyId: (id: string | undefined) => void;
  setEditIngRecipeId: (id: string | undefined) => void;
  handleSaveIngredient: (index: number) => void;
  showSubRecipes: boolean;
  footerLabel: string;
  footerValue: string;
}

const IngredientTable = React.memo<IngredientTableProps>(({
  ingredients,
  supplies,
  recipes,
  getRecipeCost,
  formatCurrency,
  parentId,
  editingIngredientIndex,
  editingIngredientSubRecipeId,
  editIngQuantity,
  editIngSupplyId,
  editIngRecipeId,
  setEditingIngredientIndex,
  setEditingIngredientSubRecipeId,
  setEditIngQuantity,
  setEditIngSupplyId,
  setEditIngRecipeId,
  handleSaveIngredient,
  showSubRecipes,
  footerLabel,
  footerValue,
}) => {
  return (
    <div className="p-3 bg-white space-y-3">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[9px] font-black uppercase text-slate-400">
            <th className="pb-1.5 pl-1 w-20">Cantidad</th>
            <th className="pb-1.5">Nombre del Insumo</th>
            <th className="pb-1.5 pr-1 text-right w-28">Costo Unit. / Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-xs">
          {ingredients.length > 0 ? (
            ingredients.map((ing, idx) => {
              const supply = supplies.find(s => s.id === ing.supplyId);
              const nestedSub = recipes.find(r => r.id === ing.recipeId);
              const name = supply ? supply.name : (nestedSub ? nestedSub.name : 'Insumo no vinculado');
              const unit = supply ? supply.unit : (nestedSub ? nestedSub.yieldUnit : '');
              const unitCost = supply ? supply.cost : (nestedSub ? getRecipeCost(nestedSub) / (nestedSub.yield || 1) : 0);
              const lineCost = unitCost * ing.quantity;

              const isEditing = editingIngredientIndex === idx && editingIngredientSubRecipeId === parentId;

              const searchOptions = showSubRecipes
                ? [
                    ...supplies.map(s => ({ id: `supply_${s.id}`, name: `[Insumo] ${s.name}`, unit: s.unit })),
                    ...recipes.filter(r => r.type === 'sub').map(r => ({ id: `recipe_${r.id}`, name: `[Sub-receta] ${r.name}`, unit: r.yieldUnit || 'receta' }))
                  ]
                : supplies.map(s => ({ id: `supply_${s.id}`, name: `[Insumo] ${s.name}`, unit: s.unit }));

              return (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors group/row">
                  {isEditing ? (
                    <td colSpan={3} className="py-2 px-1">
                      <div className="bg-rose-50/90 p-2.5 rounded-xl border border-rose-200 shadow-sm space-y-2">
                        <div>
                          <label className="text-[9px] font-black uppercase text-rose-600 block mb-1">
                            {showSubRecipes ? 'Seleccionar Insumo o Sub-receta Vinculada' : 'Seleccionar Insumo Directo Vinculado'}
                          </label>
                          <SearchableSelect
                            options={searchOptions}
                            value={editIngSupplyId ? `supply_${editIngSupplyId}` : editIngRecipeId ? `recipe_${editIngRecipeId}` : ''}
                            onChange={(val) => {
                              if (val.startsWith('supply_')) {
                                setEditIngSupplyId(val.replace('supply_', ''));
                                setEditIngRecipeId(undefined);
                              } else if (val.startsWith('recipe_')) {
                                setEditIngRecipeId(val.replace('recipe_', ''));
                                setEditIngSupplyId(undefined);
                              }
                            }}
                            placeholder="Escribe para buscar..."
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-rose-100/80">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Cantidad:</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editIngQuantity}
                              onChange={(e) => setEditIngQuantity(parseFloat(e.target.value) || 0)}
                              className="w-24 text-xs p-1.5 border border-rose-200 rounded-lg bg-white text-center font-bold"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSaveIngredient(idx)}
                              className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => {
                                setEditingIngredientIndex(null);
                                setEditingIngredientSubRecipeId(null);
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-2 pl-1 font-bold text-slate-600 tabular-nums">
                        {ing.quantity} <span className="text-[10px] text-slate-400 font-normal">{unit}</span>
                      </td>
                      <td className="py-2 font-bold text-slate-800">
                        {name}
                      </td>
                      <td className="py-2 pr-1 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex flex-col text-right">
                            <span className="font-black text-slate-900 tabular-nums">{formatCurrency(lineCost)}</span>
                            <span className="text-[9px] text-slate-400 tabular-nums">
                              ({formatCurrency(unitCost)}/{unit || 'un'})
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setEditingIngredientSubRecipeId(parentId);
                              setEditingIngredientIndex(idx);
                              setEditIngQuantity(ing.quantity);
                              setEditIngSupplyId(ing.supplyId);
                              setEditIngRecipeId(ing.recipeId);
                            }}
                            className="opacity-0 group-hover/row:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                            title="Editar ingrediente"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="py-3 text-center text-slate-400 italic">No hay ingredientes en esta sub-receta.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center mt-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {footerLabel}
        </span>
        <span className="text-sm font-black text-slate-900 tabular-nums">
          {footerValue}
        </span>
      </div>
    </div>
  );
});
