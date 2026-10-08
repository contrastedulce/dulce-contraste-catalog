import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Plus,
  BookOpen
} from 'lucide-react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { SearchableSelect } from '../shared/SearchableSelect';
import { Supply, Recipe, RecipeIngredient } from '../../types';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplies: Supply[];
  recipes: Recipe[];
  onImport: (newRecipes: Recipe[], newSupplies: Supply[]) => void;
}

interface ParsedRow {
  recipeName: string;
  subRecipeName: string;
  rawIngredient: string;
  quantity: number;
  unit: string;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  supplies,
  recipes,
  onImport
}) => {
  const [step, setStep] = useState<'paste' | 'map' | 'preview'>('paste');
  const [pastedText, setPastedText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [ingredientMapping, setIngredientMapping] = useState<Record<string, { action: 'map' | 'create'; supplyId?: string; recipeId?: string; category?: 'Secos' | 'Lácteos' | 'Frescos' | 'Packaging' }>>({});
  const [recipeTypes, setRecipeTypes] = useState<Record<string, 'complete' | 'sub'>>({});

  // Helper to normalize string for comparison
  const normalizeName = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9áéíóúñ]/g, '');
  };

  const handleParse = () => {
    if (!pastedText.trim()) return;

    const lines = pastedText.split(/\r?\n/);
    if (lines.length === 0) return;

    // Detect delimiter
    const sampleLine = lines[0];
    const isTab = sampleLine.includes('\t');
    const delimiter = isTab ? '\t' : (sampleLine.includes(';') ? ';' : ',');

    // Parse all rows
    const rawGrid = lines
      .map(line => line.split(delimiter).map(cell => cell.trim()))
      .filter(row => row.some(cell => cell !== ''));

    if (rawGrid.length === 0) return;

    // Try to detect headers in the first 3 lines
    let headerIndex = -1;
    let colIndices = {
      recipeName: 1, // Default Column 1 (Item)
      subRecipeName: 0, // Default Column 0 (Column2)
      ingredientName: 3, // Default Column 3 (Ingrediente real)
      quantity: 4, // Default Column 4 (Cantidad Real)
      unit: 5 // Default Column 5 (Medida Real)
    };

    for (let i = 0; i < Math.min(3, rawGrid.length); i++) {
      const row = rawGrid[i];
      const hasIngredient = row.some(cell => /ingrediente|insumo|real/i.test(cell));
      const hasQuantity = row.some(cell => /cant|real/i.test(cell) && !/ingrediente/i.test(cell));
      
      if (hasIngredient || hasQuantity) {
        headerIndex = i;
        row.forEach((cell, idx) => {
          const val = cell.toLowerCase();
          if (val.includes('item') || val.includes('name.1') || (val.includes('nombre') && !val.includes('ingrediente'))) {
            colIndices.recipeName = idx;
          } else if (val.includes('column2') || val.includes('componente') || val.includes('base') || val.includes('relleno')) {
            colIndices.subRecipeName = idx;
          } else if (val.includes('ingrediente') || val.includes('insumo')) {
            colIndices.ingredientName = idx;
          } else if (val.includes('cant')) {
            colIndices.quantity = idx;
          } else if (val.includes('medida') || val.includes('unidad') || val.includes('real')) {
            if (val.includes('medida') || val.includes('unidad')) {
              colIndices.unit = idx;
            }
          }
        });
        break;
      }
    }

    const dataRows = headerIndex !== -1 ? rawGrid.slice(headerIndex + 1) : rawGrid;
    const parsed: ParsedRow[] = [];

    dataRows.forEach(row => {
      if (row.length <= Math.max(colIndices.recipeName, colIndices.ingredientName)) return;

      const recipeName = row[colIndices.recipeName] || '';
      const subRecipeName = row[colIndices.subRecipeName] || '';
      const rawIngredient = row[colIndices.ingredientName] || '';
      const quantityStr = row[colIndices.quantity] || '0';
      const unit = row[colIndices.unit] || 'gramos';

      if (!recipeName || !rawIngredient) return;

      const quantity = parseFloat(quantityStr.replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

      parsed.push({
        recipeName,
        subRecipeName,
        rawIngredient,
        quantity,
        unit
      });
    });

    if (parsed.length === 0) {
      alert('No se pudieron detectar filas válidas. Revisa que el formato tenga columnas para Receta/Item, Ingrediente y Cantidad.');
      return;
    }

    setParsedRows(parsed);

    const uniqueIngs = Array.from(new Set(parsed.map(p => p.rawIngredient)));
    const initialMapping: Record<string, { action: 'map' | 'create'; supplyId?: string; recipeId?: string; category?: 'Secos' | 'Lácteos' | 'Frescos' | 'Packaging' }> = {};

    uniqueIngs.forEach(ing => {
      const normalizedIng = normalizeName(ing);

      // 1. Check if it matches an existing recipe (sub-recipe)
      const matchedRecipe = recipes.find(r => normalizeName(r.name) === normalizedIng || r.name.toLowerCase().includes(ing.toLowerCase()));
      if (matchedRecipe) {
        initialMapping[ing] = {
          action: 'map',
          recipeId: matchedRecipe.id
        };
        return;
      }

      // 2. Check if it matches a supply
      const matchedSupply = supplies.find(s => normalizeName(s.name) === normalizedIng || s.name.toLowerCase().includes(ing.toLowerCase()));
      if (matchedSupply) {
        initialMapping[ing] = {
          action: 'map',
          supplyId: matchedSupply.id
        };
        return;
      }

      // 3. No match - create new supply
      initialMapping[ing] = {
        action: 'create',
        category: ing.toLowerCase().includes('envase') || ing.toLowerCase().includes('caja') || ing.toLowerCase().includes('bolsa') ? 'Packaging' : 'Secos'
      };
    });

    setIngredientMapping(initialMapping);

    const uniqueRecipes = Array.from(new Set(parsed.map(p => p.recipeName)));
    const initialTypes: Record<string, 'complete' | 'sub'> = {};
    uniqueRecipes.forEach(r => {
      initialTypes[r] = 'complete';
    });
    setRecipeTypes(initialTypes);

    setStep('map');
  };

  const handleApplyImport = () => {
    const suppliesToAdd: Supply[] = [];
    const newSupplyIdMap: Record<string, string> = {};
    const newRecipeIdMap: Record<string, string> = {};

    Object.entries(ingredientMapping).forEach(([rawName, value]) => {
      const val = value as { action: 'map' | 'create'; supplyId?: string; recipeId?: string; category?: 'Secos' | 'Lácteos' | 'Frescos' | 'Packaging' };
      if (val.action === 'create') {
        const newId = 'sup_' + Math.random().toString(36).substr(2, 9);
        const sampleUnit = parsedRows.find(p => p.rawIngredient === rawName)?.unit || 'gramos';

        suppliesToAdd.push({
          id: newId,
          name: rawName,
          unit: sampleUnit,
          cost: 0,
          category: val.category || 'Secos',
          stock: 0,
          minStock: 0
        });

        newSupplyIdMap[rawName] = newId;
      } else if (val.action === 'map' && val.recipeId) {
        newRecipeIdMap[rawName] = val.recipeId;
      } else if (val.action === 'map' && val.supplyId) {
        newSupplyIdMap[rawName] = val.supplyId;
      }
    });

    const recipesToAdd: Recipe[] = [];
    const recipeIdMap: Record<string, string> = {};

    // Helper: map a raw ingredient name to its final RecipeIngredient
    const mapToIngredient = (rawName: string, quantity: number): RecipeIngredient | null => {
      // 1. Check if user explicitly mapped it to a recipe
      if (newRecipeIdMap[rawName]) {
        return { recipeId: newRecipeIdMap[rawName], quantity };
      }
      // 2. Check if user mapped it to a supply
      if (newSupplyIdMap[rawName]) {
        return { supplyId: newSupplyIdMap[rawName], quantity };
      }
      // 3. Check if it matches an existing recipe by name
      const normalizedIng = normalizeName(rawName);
      const existingRecipe = recipes.find(r => normalizeName(r.name) === normalizedIng && r.type === 'sub');
      if (existingRecipe) {
        return { recipeId: existingRecipe.id, quantity };
      }
      // 4. Check if it matches a supply by name
      const existingSupply = supplies.find(s => normalizeName(s.name) === normalizedIng);
      if (existingSupply) {
        return { supplyId: existingSupply.id, quantity };
      }
      return null;
    };

    // Helper to get or create ID
    const getRecipeId = (name: string, forceType: 'sub' | 'complete') => {
      const normalizedName = normalizeName(name);
      const existing = recipes.find(r => normalizeName(r.name) === normalizedName && r.type === forceType);
      if (existing) return existing.id;
      if (!recipeIdMap[name]) {
        recipeIdMap[name] = 'rec_' + Math.random().toString(36).substr(2, 9);
      }
      return recipeIdMap[name];
    };

    // 1. Group by subRecipeName to create Sub-Recipes
    const subRecipesGrouped: Record<string, ParsedRow[]> = {};
    parsedRows.forEach(row => {
      if (row.subRecipeName) {
        if (!subRecipesGrouped[row.subRecipeName]) subRecipesGrouped[row.subRecipeName] = [];
        subRecipesGrouped[row.subRecipeName].push(row);
      }
    });

    Object.entries(subRecipesGrouped).forEach(([subName, rows]) => {
      const id = getRecipeId(subName, 'sub');
      const ingredients: RecipeIngredient[] = rows.map(r => {
        return mapToIngredient(r.rawIngredient, r.quantity);
      }).filter(Boolean) as RecipeIngredient[];

      recipesToAdd.push({
        id,
        name: subName,
        type: 'sub',
        ingredients,
        equipment: [],
        laborCost: 0,
        laborMinutes: { heavy: 0, light: 0 },
        serviceMinutes: { electricity: 0, water: 0, gas: 0, machinery: 0, utensils: 0 },
        extraCosts: { biosecurity: 0, packaging: 0 },
        yield: 1,
        yieldUnit: 'un'
      });
    });

    // 2. Group by recipeName to create Complete Recipes
    const completeRecipesGrouped: Record<string, { directRows: ParsedRow[], subRecipes: string[] }> = {};
    parsedRows.forEach(row => {
      if (!completeRecipesGrouped[row.recipeName]) {
        completeRecipesGrouped[row.recipeName] = { directRows: [], subRecipes: [] };
      }
      if (row.subRecipeName) {
        if (!completeRecipesGrouped[row.recipeName].subRecipes.includes(row.subRecipeName)) {
          completeRecipesGrouped[row.recipeName].subRecipes.push(row.subRecipeName);
        }
      } else {
        completeRecipesGrouped[row.recipeName].directRows.push(row);
      }
    });

    Object.entries(completeRecipesGrouped).forEach(([recipeName, data]) => {
      const id = getRecipeId(recipeName, 'complete');

      const ingredients: RecipeIngredient[] = data.directRows.map(r => {
        return mapToIngredient(r.rawIngredient, r.quantity);
      }).filter(Boolean) as RecipeIngredient[];

      data.subRecipes.forEach(subName => {
        const subId = getRecipeId(subName, 'sub');
        ingredients.push({
          recipeId: subId,
          quantity: 1 // Default to 1 batch of sub-recipe
        });
      });

      recipesToAdd.push({
        id,
        name: recipeName,
        type: 'complete',
        ingredients,
        equipment: [],
        laborCost: 0,
        laborMinutes: { heavy: 0, light: 0 },
        serviceMinutes: { electricity: 0, water: 0, gas: 0, machinery: 0, utensils: 0 },
        extraCosts: { biosecurity: 0, packaging: 0 },
        yield: 1,
        yieldUnit: 'un'
      });
    });

    onImport(recipesToAdd, suppliesToAdd);
    onClose();
    setStep('paste');
    setPastedText('');
    setParsedRows([]);
  };

  const uniqueParsedIngredients = useMemo(() => {
    return Array.from(new Set(parsedRows.map(p => p.rawIngredient)));
  }, [parsedRows]);

  const uniqueRecipes = useMemo(() => {
    return Array.from(new Set(parsedRows.map(p => p.recipeName)));
  }, [parsedRows]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Importar Recetas desde Excel"
      description="Sube de forma masiva tus recetas previamente costeadas o limpiadas con Power Query."
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 py-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-6">
            <span className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${step === 'paste' ? 'text-rose-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 'paste' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 text-slate-400'}`}>1</span>
              Pegar Datos
            </span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${step === 'map' ? 'text-rose-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 'map' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 text-slate-400'}`}>2</span>
              Mapear Insumos
            </span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${step === 'preview' ? 'text-rose-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 'preview' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 text-slate-400'}`}>3</span>
              Vista Previa
            </span>
          </div>
        </div>

        {step === 'paste' && (
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-rose-800 text-sm flex gap-3">
              <ClipboardList className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">¿Cómo pegar tus datos?</p>
                <p className="text-xs text-rose-700 mt-1">
                  En Excel, selecciona la tabla limpia de Power Query que contiene tus columnas: <strong>Item (Nombre de Receta)</strong>, <strong>Ingrediente real</strong>, <strong>Cantidad Real</strong> y <strong>Medida Real</strong>. Cópialas (Ctrl+C) y pégalas aquí directamente.
                </p>
              </div>
            </div>

            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Pega las celdas de tu Excel aquí...&#10;&#10;Ejemplo:&#10;Item&#109;Ingrediente real&#109;Cantidad Real&#109;Medida Real&#10;ALFAJORES CLASICOS&#109;Maicena&#109;80&#109;gramos&#10;ALFAJORES CLASICOS&#109;Margarina&#109;200&#109;gramos"
              className="w-full h-80 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-rose-500/10 focus:outline-none custom-scrollbar"
            />

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={onClose}>Cancelar</Button>
              <Button variant="primary" disabled={!pastedText.trim()} onClick={handleParse} icon={ChevronRight}>Procesar Datos</Button>
            </div>
          </div>
        )}

        {step === 'map' && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 text-slate-600 text-xs flex gap-3">
              <HelpCircle className="shrink-0 text-slate-400 mt-0.5" />
              <div>
                <p className="font-bold text-slate-700">Mapeo de Materia Prima</p>
                <p className="mt-1 leading-relaxed">
                  Para asegurar el correcto costeo automático, debemos asociar cada ingrediente de tu Excel con un insumo del catálogo.
                  Si no deseas asociarlo, el sistema creará un insumo nuevo con costo unitario de S/. 0 para que lo edites más tarde.
                </p>
              </div>
            </div>

            <div className="max-h-95 overflow-y-auto rounded-2xl border border-slate-100 bg-white custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4">Ingrediente en Excel</th>
                    <th className="p-4">Estado / Acción</th>
                    <th className="p-4">Insumo del Inventario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {uniqueParsedIngredients.map(ing => {
                    const mapping = ingredientMapping[ing];
                    if (!mapping) return null;

                    const isMapped = mapping.action === 'map';
                    const isRecipeMatch = isMapped && !!mapping.recipeId;

                    return (
                      <tr key={ing} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-700">{ing}</td>
                        <td className="p-4">
                          {isRecipeMatch ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
                              <BookOpen size={12} /> Receta vinculada
                            </span>
                          ) : isMapped ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                              <CheckCircle2 size={12} /> Coincidencia
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                              <AlertTriangle size={12} /> Nuevo Insumo
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 items-start">
                            <div className="min-w-65">
                              <SearchableSelect
                                options={[
                                  { id: 'new', name: '🆕 Crear Nuevo Insumo', unit: '' },
                                  ...recipes.filter(r => r.type === 'sub').map(r => ({ id: `rec_${r.id}`, name: `📋 ${r.name} (Sub-receta)`, unit: r.yieldUnit })),
                                  ...supplies.map(s => ({ id: s.id, name: s.name, unit: s.unit }))
                                ]}
                                value={isRecipeMatch ? `rec_${mapping.recipeId}` : isMapped ? (mapping.supplyId || 'new') : 'new'}
                                onChange={(val) => {
                                  if (val === 'new') {
                                    setIngredientMapping(prev => ({
                                      ...prev,
                                      [ing]: { action: 'create', category: 'Secos' }
                                    }));
                                  } else if (val.startsWith('rec_')) {
                                    setIngredientMapping(prev => ({
                                      ...prev,
                                      [ing]: { action: 'map', recipeId: val.replace('rec_', ''), supplyId: undefined }
                                    }));
                                  } else {
                                    setIngredientMapping(prev => ({
                                      ...prev,
                                      [ing]: { action: 'map', supplyId: val, recipeId: undefined }
                                    }));
                                  }
                                }}
                                placeholder="Buscar insumo o receta..."
                              />
                            </div>

                            {!isMapped && (
                              <select
                                value={mapping.category || 'Secos'}
                                onChange={(e) => {
                                  setIngredientMapping(prev => ({
                                    ...prev,
                                    [ing]: { ...prev[ing], category: e.target.value as any }
                                  }));
                                }}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 focus:outline-none"
                              >
                                <option value="Secos">Secos</option>
                                <option value="Lácteos">Lácteos</option>
                                <option value="Frescos">Frescos</option>
                                <option value="Packaging">Packaging</option>
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="secondary" onClick={() => setStep('paste')} icon={ChevronLeft}>Atrás</Button>
              <Button variant="primary" onClick={() => setStep('preview')} icon={ChevronRight}>Siguiente</Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-slate-700 text-xs flex gap-3">
              <Sparkles className="shrink-0 text-rose-500 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Casi listo: Revisa la estructura</p>
                <p className="mt-1 leading-relaxed">
                  Hemos detectado <strong>{uniqueRecipes.length} recetas</strong> listas para importar.
                  Selecciona la categoría/tipo de cada receta para guardarla correctamente en la base de datos.
                </p>
              </div>
            </div>

            <div className="max-h-95 overflow-y-auto rounded-2xl border border-slate-100 bg-white custom-scrollbar p-2 space-y-4">
              {uniqueRecipes.map(recipeName => {
                const recipeRows = parsedRows.filter(p => p.recipeName === recipeName);
                const type = recipeTypes[recipeName] || 'complete';

                return (
                  <div key={recipeName} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-rose-500" />
                        <h4 className="font-black text-sm text-slate-800">{recipeName}</h4>
                      </div>
                      <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit">
                        <button
                          onClick={() => setRecipeTypes(prev => ({ ...prev, [recipeName]: 'complete' }))}
                          className={`px-3 py-1 rounded-lg font-black text-[10px] transition-all uppercase tracking-wider ${type === 'complete' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          Completa
                        </button>
                        <button
                          onClick={() => setRecipeTypes(prev => ({ ...prev, [recipeName]: 'sub' }))}
                          className={`px-3 py-1 rounded-lg font-black text-[10px] transition-all uppercase tracking-wider ${type === 'sub' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          Base / Relleno
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {recipeRows.map((row, idx) => {
                        const mapping = ingredientMapping[row.rawIngredient];
                        const targetName = mapping?.action === 'map' && mapping.supplyId 
                          ? supplies.find(s => s.id === mapping.supplyId)?.name 
                          : row.rawIngredient;

                        return (
                          <div key={idx} className="flex justify-between items-center p-2 bg-white rounded-xl border border-slate-100 text-[11px] font-bold text-slate-500">
                            <span className="text-slate-700 line-clamp-1 max-w-[70%]">{targetName}</span>
                            <span className="text-rose-600 font-extrabold">{row.quantity} {row.unit}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <Button variant="secondary" onClick={() => setStep('map')} icon={ChevronLeft}>Atrás</Button>
              <Button variant="primary" onClick={handleApplyImport} icon={Plus}>Importar {uniqueRecipes.length} Recetas</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
