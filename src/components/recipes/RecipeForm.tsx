import React from 'react';
import { Plus, Trash2, Sparkles, ChefHat, Clock, Zap, Box, Calculator, Info, Anchor, BookOpen, Edit3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Recipe, Supply, Equipment, IngredientMapping } from '../../types';
import { SearchableSelect } from '../shared/SearchableSelect';

interface RecipeFormProps {
  recipeFormData: Partial<Recipe>;
  setRecipeFormData: (data: any) => void;
  supplies: Supply[];
  recipes: Recipe[];
  equipment: Equipment[];
  onSave: () => void;
  onQuickCreateSupply?: (name: string, idx: number) => void;
  onEditSupply?: (supplyId: string) => void;
  ingredientMappings?: IngredientMapping[];
  onRegisterMappings?: (mappings: IngredientMapping[]) => void;
  professorColors?: { name: string; color: string }[];
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  recipeFormData,
  setRecipeFormData,
  supplies,
  recipes,
  equipment,
  onSave,
  onQuickCreateSupply,
  onEditSupply,
  ingredientMappings = [],
  onRegisterMappings,
  professorColors = []
}) => {
  const [pastedRecipeText, setPastedRecipeText] = React.useState('');
  const [isExtracting, setIsExtracting] = React.useState(false);
  const [extractionError, setExtractionError] = React.useState<string | null>(null);

  const handleIAExtract = async () => {
    if (!pastedRecipeText.trim()) {
      setExtractionError("Por favor pega el texto de tu receta primero.");
      return;
    }
    setIsExtracting(true);
    setExtractionError(null);

    try {
      // Structure recipe with Gemini AI directly from pasted text
      const aiPrompt = `Analiza la siguiente receta de pastelería y extrae de manera súper estructurada el contenido en formato JSON válido.
      DETECCION DE SUB-RECETAS (MUY IMPORTANTE):
      Identifica si el texto de la receta contiene sub-secciones de componentes o bases (ejemplos: "Masa de pie", "Relleno de pecanas", "Para la Masa", "Para la Mermelada", "Para el Glaseado", "Frosting", "Bizcocho", "Almíbar", etc.).
      
      - Si detectas sub-secciones, crea una sub-receta independiente para cada una en el array "subRecipes". Cada sub-receta debe tener su propio "name", sus "ingredients" y sus "instructions".
      - En "name" general coloca el nombre de la receta completa (ej: "PECAN PIE" o "PAN DULCE DE FRUTOS ROJOS").
      - En "ingredients" (nivel raíz) coloca cualquier ingrediente directo que no pertenezca a ninguna sub-sección.
      - En "instructions" (nivel raíz) coloca las instrucciones generales de armado, horneado o ensamble final.
      - Si NO hay sub-secciones (es una receta simple sin divisiones), deja "subRecipes" como un array vacío [] y coloca todos los ingredientes en "ingredients".
      
      Si hay cantidades como "c.n." (cantidad necesaria), usa 0 como cantidad.
      
      Es obligatorio que respetes la siguiente estructura JSON:
      {
        "name": "Nombre General de la Receta Completa",
        "yield": 1,
        "yieldUnit": "porciones / unidades",
        "subRecipes": [
          {
            "name": "Nombre de la Sub-receta (ej: Masa de pie)",
            "ingredients": [
              { "name": "Harina", "quantity": 375, "unit": "g" }
            ],
            "instructions": [
              "Realizar una arena con la mantequilla..."
            ]
          }
        ],
        "ingredients": [
          { "name": "nombre del insumo directo", "quantity": 125, "unit": "g" }
        ],
        "instructions": [
          "Instrucciones generales de armado u horneado..."
        ]
      }`;

      const aiRes = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'gemini',
          prompt: aiPrompt,
          chunk: pastedRecipeText,
          schema: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              yield: { type: "NUMBER" },
              yieldUnit: { type: "STRING" },
              subRecipes: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    ingredients: {
                      type: "ARRAY",
                      items: {
                        type: "OBJECT",
                        properties: {
                          name: { type: "STRING" },
                          quantity: { type: "NUMBER" },
                          unit: { type: "STRING" }
                        },
                        required: ["name", "quantity", "unit"]
                      }
                    },
                    instructions: {
                      type: "ARRAY",
                      items: { type: "STRING" }
                    }
                  },
                  required: ["name", "ingredients", "instructions"]
                }
              },
              ingredients: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    quantity: { type: "NUMBER" },
                    unit: { type: "STRING" }
                  },
                  required: ["name", "quantity", "unit"]
                }
              },
              instructions: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            required: ["name", "yield", "yieldUnit", "subRecipes", "ingredients", "instructions"]
          }
        })
      });

      if (!aiRes.ok) {
        throw new Error("La Inteligencia Artificial de Gemini no pudo procesar la receta en este momento.");
      }

      const aiData = await aiRes.json();
      const extractedRecipe = JSON.parse(aiData.text);

      // Helper function to match ingredient to supplies or existing sub-recipes
      const matchIng = (ing: any) => {
        const lowerName = ing.name.toLowerCase();

        // 0. FIRST CHECK USER'S SAVED CUSTOM MAPPINGS
        const customMapping = ingredientMappings.find(m => m.rawName.toLowerCase() === lowerName);
        if (customMapping) {
          let finalQty = ing.quantity;
          if (customMapping.equivalenceRatio && customMapping.originalUnit === ing.unit) {
            finalQty = ing.quantity * customMapping.equivalenceRatio;
          }
          if (customMapping.supplyId) {
            return {
              supplyId: customMapping.supplyId,
              quantity: finalQty,
              name: ing.name,
              originalQuantity: ing.quantity,
              originalUnit: ing.unit || '',
              isFixed: false
            };
          }
          if (customMapping.recipeId) {
            return {
              recipeId: customMapping.recipeId,
              quantity: finalQty,
              name: ing.name,
              originalQuantity: ing.quantity,
              originalUnit: ing.unit || '',
              isFixed: false
            };
          }
        }

        // 1. Fallback to basic string matching
        const matchedSupply = supplies.find(s => 
          s.name.toLowerCase().includes(lowerName) || lowerName.includes(s.name.toLowerCase())
        );
        if (matchedSupply) {
          return {
            supplyId: matchedSupply.id,
            quantity: ing.quantity,
            name: ing.name,
            originalQuantity: ing.quantity,
            originalUnit: ing.unit || '',
            isFixed: false
          };
        }
        const matchedRecipe = recipes.find(r => 
          r.name.toLowerCase().includes(lowerName) || lowerName.includes(r.name.toLowerCase())
        );
        if (matchedRecipe && matchedRecipe.id !== recipeFormData.id) {
          return {
            recipeId: matchedRecipe.id,
            quantity: ing.quantity,
            name: ing.name,
            originalQuantity: ing.quantity,
            originalUnit: ing.unit || '',
            isFixed: false
          };
        }
        return {
          quantity: ing.quantity,
          name: ing.name,
          originalQuantity: ing.quantity,
          originalUnit: ing.unit || '',
          isFixed: false
        };
      };

      const generatedSubRecipes: Recipe[] = [];
      const mainIngredients: any[] = [];
      const combinedInstructions: string[] = [];

      // Process subRecipes if present
      if (Array.isArray(extractedRecipe.subRecipes) && extractedRecipe.subRecipes.length > 0) {
        for (const sr of extractedRecipe.subRecipes) {
          const subRecipeId = Math.random().toString(36).substr(2, 9);
          const subIngredients = (sr.ingredients || []).map(matchIng);
          const subInstructions = sr.instructions || [];

          // Create sub-recipe object for "Bases y Rellenos"
          const newSubRecipe: Recipe = {
            id: subRecipeId,
            name: sr.name,
            type: 'sub',
            yield: 1,
            yieldUnit: 'receta',
            ingredients: subIngredients,
            equipment: [],
            laborCost: 0,
            instructions: subInstructions,
            rawText: `SUB-RECETA: ${sr.name}\n\nINGREDIENTES:\n` +
              (sr.ingredients || []).map((i: any) => `- ${i.name}: ${i.quantity} ${i.unit || ''}`).join('\n') +
              `\n\nPREPARACIÓN:\n` + subInstructions.map((s: string) => `- ${s}`).join('\n')
          };

          generatedSubRecipes.push(newSubRecipe);

          // Link sub-recipe as an ingredient in main complete recipe
          mainIngredients.push({
            recipeId: subRecipeId,
            quantity: 1,
            name: sr.name,
            isFixed: false
          });

          // Add sub-recipe instructions to main instructions list
          if (subInstructions.length > 0) {
            combinedInstructions.push(`[${sr.name}] ${subInstructions.join(' | ')}`);
          }
        }
      }

      // Add direct ingredients (if any)
      if (Array.isArray(extractedRecipe.ingredients)) {
        for (const ing of extractedRecipe.ingredients) {
          mainIngredients.push(matchIng(ing));
        }
      }

      // Add main instructions
      if (Array.isArray(extractedRecipe.instructions)) {
        combinedInstructions.push(...extractedRecipe.instructions);
      }

      setRecipeFormData({
        ...recipeFormData,
        name: extractedRecipe.name || recipeFormData.name || '',
        type: 'complete',
        yield: extractedRecipe.yield || recipeFormData.yield || 1,
        yieldUnit: extractedRecipe.yieldUnit || recipeFormData.yieldUnit || 'un',
        ingredients: mainIngredients,
        instructions: combinedInstructions,
        rawText: pastedRecipeText,
        generatedSubRecipes: generatedSubRecipes.length > 0 ? generatedSubRecipes : undefined
      });

      // Clear the textarea after successful extraction
      setPastedRecipeText('');

    } catch (err: any) {
      console.error("AI Extraction Error:", err);
      setExtractionError(err.message || "Error al procesar la receta.");
    } finally {
      setIsExtracting(false);
    }
  };

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
      {/* Paste Recipe Text & AI Auto-fill Section */}
      <div className="bg-linear-to-br from-rose-500/5 to-purple-500/5 p-6 rounded-3xl border border-rose-500/10 space-y-4 shadow-sm">
        <h4 className="text-sm font-black text-slate-700 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" />
          Pegar Receta y Autocompletar con IA
        </h4>
        <p className="text-xs text-slate-500 font-medium">
          Pega el texto de tu receta (copiado desde PDF, Word o cualquier fuente) y deja que la IA configure el nombre, sub-recetas (si las hay), ingredientes y pasos automáticamente.
        </p>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Texto de la Receta</label>
          <textarea
            value={pastedRecipeText}
            onChange={(e) => setPastedRecipeText(e.target.value)}
            placeholder={"Pega aquí el texto de tu receta...\n\nEjemplo:\nPECAN PIE\n\nIngredientes\nHarina 375 gr\nAzúcar 62 gr\nMantequilla fría en cubos 188 gr\n...\n\nPreparación:\n• Realizar una arena con la mantequilla..."}
            className="w-full p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl font-mono text-sm text-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all resize-y placeholder:text-slate-300"
            rows={10}
          />
        </div>

        {pastedRecipeText.trim() && (
          <div className="pt-1 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleIAExtract}
              disabled={isExtracting}
              className={cn(
                "w-full py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-md transition-all flex items-center justify-center gap-2",
                isExtracting 
                  ? "bg-slate-400 cursor-not-allowed shadow-none" 
                  : "bg-linear-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 hover:shadow-lg active:scale-95 cursor-pointer"
              )}
            >
              {isExtracting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando con Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Importar Receta con IA</span>
                </>
              )}
            </button>
          </div>
        )}

        {extractionError && (
          <p className="text-xs font-black text-rose-500 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
            ⚠ {extractionError}
          </p>
        )}

        {recipeFormData.generatedSubRecipes && recipeFormData.generatedSubRecipes.length > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-black text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>✨ {recipeFormData.generatedSubRecipes.length} Sub-receta(s) creadas automáticamente:</span>
            </div>
            <ul className="list-disc list-inside font-bold text-purple-800 space-y-1 pl-1">
              {recipeFormData.generatedSubRecipes.map(sr => (
                <li key={sr.id}>
                  <span className="font-extrabold">{sr.name}</span> ({sr.ingredients.length} ingredientes)
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-purple-600 font-medium leading-relaxed">
              Al hacer clic en <strong>Guardar Receta</strong>, se añadirán a la pestaña <em>"Bases y Rellenos"</em> y se vincularán como ingredientes de esta receta completa.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre de la Receta</label>
        <input
          type="text"
          value={recipeFormData?.name || ''}
          onChange={(e) => setRecipeFormData({ ...recipeFormData, name: e.target.value })}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      {/* Profesor / Autor */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Profesor / Autor</label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRecipeFormData({ ...recipeFormData, author: undefined })}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border",
              !recipeFormData.author
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
            )}
          >
            Sin autor
          </button>
          {professorColors.map(prof => (
            <button
              key={prof.name}
              type="button"
              onClick={() => setRecipeFormData({ ...recipeFormData, author: prof.name })}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                recipeFormData.author === prof.name
                  ? "text-white shadow-sm"
                  : "bg-white text-slate-600 hover:border-slate-300"
              )}
              style={recipeFormData.author === prof.name
                ? { backgroundColor: prof.color, borderColor: prof.color }
                : { borderColor: `${prof.color}50` }
              }
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: recipeFormData.author === prof.name ? '#fff' : prof.color }}
              />
              {prof.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Imagen de la Receta (URL o base64)</label>
        <input
          type="text"
          value={recipeFormData?.image || ''}
          onChange={(e) => setRecipeFormData({ ...recipeFormData, image: e.target.value })}
          placeholder="https://ejemplo.com/torta.jpg"
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
                <div className="flex-1 flex gap-2 items-center">
                  <div className="flex-1">
                    <SearchableSelect
                      options={[
                        ...supplies.map(s => ({ id: s.id, name: s.name, unit: s.unit })),
                        ...recipes.filter(r => r.id !== recipeFormData.id).map(r => ({ id: r.id, name: r.name, unit: r.yieldUnit })),
                        ...(recipeFormData.generatedSubRecipes || []).map(r => ({ id: r.id, name: `[Nueva Sub-receta] ${r.name}`, unit: r.yieldUnit })),
                        ...(ing.name && !ing.supplyId && !ing.recipeId ? [{ id: `temp_${idx}`, name: `⚠️ [CREAR] ${ing.name}` }] : [])
                      ]}
                      value={ing.supplyId || ing.recipeId || (ing.name && !ing.supplyId && !ing.recipeId ? `temp_${idx}` : '')}
                      onChange={(id) => {
                        const isGenRecipe = (recipeFormData.generatedSubRecipes || []).some(r => r.id === id);
                        const isRecipe = recipes.some(r => r.id === id) || isGenRecipe;
                        const newIngs = [...(recipeFormData.ingredients || [])];
                        if (isRecipe) {
                          newIngs[idx] = { ...newIngs[idx], recipeId: id, supplyId: undefined, name: undefined };
                        } else if (id.startsWith('temp_')) {
                          // keep as temp
                        } else {
                          newIngs[idx] = { ...newIngs[idx], supplyId: id, recipeId: undefined, name: undefined };
                        }
                        setRecipeFormData({ ...recipeFormData, ingredients: newIngs });
                      }}
                      onAddNew={(name) => onQuickCreateSupply?.(name, idx)}
                      placeholder="Seleccionar insumo o receta..."
                    />
                    {ing.name && !ing.supplyId && !ing.recipeId && (
                      <div className="mt-1.5 flex items-center gap-2 bg-rose-50/70 p-1.5 rounded-lg border border-rose-100/50">
                        <span className="text-[10px] text-rose-600 font-bold">⚠️ Insumo no registrado: "{ing.name}"</span>
                        <button
                          type="button"
                          onClick={() => onQuickCreateSupply?.(ing.name!, idx)}
                          className="text-[9px] font-black text-rose-500 hover:text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200 uppercase transition-all shadow-sm"
                        >
                          + Crear
                        </button>
                      </div>
                    )}
                  </div>
                  {ing.supplyId && onEditSupply && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEditSupply(ing.supplyId!);
                      }}
                      className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                      title="Editar este Insumo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
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
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preparación (Procedimiento)</label>
          </div>
          <button 
            type="button"
            onClick={() => {
              const newInstructions = [...(recipeFormData.instructions || []), ''];
              setRecipeFormData({ ...recipeFormData, instructions: newInstructions });
            }}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Agregar Paso</span>
          </button>
        </div>

        <div className="space-y-3">
          {(recipeFormData.instructions || []).map((inst, idx) => (
            <div key={idx} className="flex gap-3 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 font-bold rounded-full text-sm">
                {idx + 1}
              </span>
              <textarea
                value={inst}
                onChange={(e) => {
                  const newInstructions = [...(recipeFormData.instructions || [])];
                  newInstructions[idx] = e.target.value;
                  setRecipeFormData({ ...recipeFormData, instructions: newInstructions });
                }}
                placeholder={`Paso ${idx + 1}...`}
                className="flex-1 p-3 bg-white border border-gray-200 rounded-xl text-sm min-h-15"
              />
              <button 
                type="button"
                onClick={() => {
                  const newInstructions = [...(recipeFormData.instructions || [])];
                  newInstructions.splice(idx, 1);
                  setRecipeFormData({ ...recipeFormData, instructions: newInstructions });
                }}
                className="text-red-400 hover:text-red-600 transition-colors pt-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {(!recipeFormData.instructions || recipeFormData.instructions.length === 0) && (
            <p className="text-center text-sm text-gray-400 italic py-4">No hay pasos de preparación. Agrega uno.</p>
          )}
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
