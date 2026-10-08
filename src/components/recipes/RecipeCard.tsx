import React, { useState } from 'react';
import { ChefHat, Pencil, Trash2, ChevronRight, Clock, Box, Zap, DollarSign, Calculator, Info, Copy, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { Badge } from '../shared/Badge';
import { cn, getProfessorColor } from '../../lib/utils';
import { Recipe, AppSettings } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  getRecipeCost: (recipe: Recipe) => number;
  formatCurrency: (amount: number) => string;
  settings: AppSettings;
  delay?: number;
  readOnly?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onDuplicate,
  getRecipeCost,
  formatCurrency,
  settings,
  delay = 0,
  readOnly = false
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const totalCost = typeof getRecipeCost === 'function' ? getRecipeCost(recipe) : 0;
  const yieldVal = recipe.yield || 1;
  const costPerUnit = totalCost / yieldVal;

  // breakdown calculations
  const mc = settings.masterCosts;
  const safeNum = (n: any) => parseFloat(n) || 0;

  const heavyRate = mc ? (mc.salaries.heavy.monthly / mc.salaries.heavy.hoursPerMonth) / 60 : 0;
  const lightRate = mc ? (mc.salaries.light.monthly / mc.salaries.light.hoursPerMonth) / 60 : 0;
  
  const laborCost = mc ? (
    (safeNum(recipe.laborMinutes?.heavy) * heavyRate) + 
    (safeNum(recipe.laborMinutes?.light) * lightRate)
  ) : 0;

  const getServiceRate = (s: { monthly: number; usagePercent: number }) => 
    ((s.monthly * (s.usagePercent / 100)) / 240) / 60;

  const servicesCost = mc ? (
    (safeNum(recipe.serviceMinutes?.electricity) * getServiceRate(mc.services.electricity)) +
    (safeNum(recipe.serviceMinutes?.water) * getServiceRate(mc.services.water)) +
    (safeNum(recipe.serviceMinutes?.gas) * getServiceRate(mc.services.gas)) +
    (safeNum(recipe.serviceMinutes?.machinery) * getServiceRate(mc.services.machinery)) +
    (safeNum(recipe.serviceMinutes?.utensils) * getServiceRate(mc.services.utensils))
  ) : 0;

  const extraCost = (safeNum(recipe.extraCosts?.biosecurity) + safeNum(recipe.extraCosts?.packaging));
  const suppliesCost = Math.max(0, totalCost - laborCost - servicesCost - extraCost);

  // Suggested Price (Master Formula)
  const defaultMargin = 30; // 30% default if not specified elsewhere
  const taxTotal = (mc?.taxes.igv || 0) + (mc?.taxes.salesTax || 0);
  const suggestedPrice = costPerUnit / (1 - (defaultMargin / 100) - (taxTotal / 100));

  return (
    <GlassCard 
      delay={delay}
      className={cn(
        "group relative overflow-hidden border-none shadow-sm transition-all duration-500 hover:shadow-xl",
        isSelected && "ring-2 ring-rose-500/50 bg-rose-50/10 shadow-rose-100"
      )}
    >
      <div className="absolute top-4 left-4 z-20">
        {!readOnly && (
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect();
            }}
            className="w-5 h-5 rounded-lg border-2 border-slate-200 text-rose-600 focus:ring-rose-500 cursor-pointer transition-all checked:border-rose-600"
          />
        )}
      </div>

      <div className="flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-6 ml-10">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
            <ChefHat className="w-8 h-8" />
          </div>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowBreakdown(!showBreakdown); }}
              className={cn(
                "p-2.5 rounded-xl border border-slate-100 shadow-sm transition-all",
                showBreakdown ? "bg-indigo-500 text-white" : "bg-white text-slate-400 hover:text-indigo-600"
              )}
              title="Ver Desglose"
            >
              <Calculator className="w-4 h-4" />
            </button>
            {recipe.instructions && recipe.instructions.length > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowInstructions(!showInstructions); setShowBreakdown(false); }}
                className={cn(
                  "p-2.5 rounded-xl border border-slate-100 shadow-sm transition-all",
                  showInstructions ? "bg-rose-500 text-white" : "bg-white text-slate-400 hover:text-rose-600"
                )}
                title="Ver Preparación"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            )}
            {!readOnly && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                  className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm border border-slate-100 transition-all"
                  title="Duplicar Receta"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 shadow-sm border border-slate-100 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="p-2.5 bg-white hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 shadow-sm border border-slate-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="ml-10 mb-6">
          <h4 className="font-black text-xl text-slate-800 leading-tight group-hover:text-rose-600 transition-colors">{recipe.name}</h4>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant={recipe.type === 'complete' ? 'emerald' : 'purple'}>
              {recipe.type === 'complete' ? 'Completa' : 'Base / Sub-receta'}
            </Badge>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Box className="w-3 h-3" />
              Rinde: {recipe.yield} {recipe.yieldUnit || 'un'}
            </span>
            {recipe.author && getProfessorColor(recipe.author, settings.professorColors) && (
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border flex items-center gap-1.5"
                style={{
                  color: getProfessorColor(recipe.author, settings.professorColors)!,
                  backgroundColor: `${getProfessorColor(recipe.author, settings.professorColors)}15`,
                  borderColor: `${getProfessorColor(recipe.author, settings.professorColors)}40`
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: getProfessorColor(recipe.author, settings.professorColors)! }}
                />
                {recipe.author}
              </span>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showBreakdown ? (
            <motion.div 
              key="breakdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 bg-slate-50/50 p-6 rounded-3xl mb-4 border border-slate-100/50"
            >
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-2">
                <span>Elemento</span>
                <span>Costo Tot.</span>
              </div>
              <BreakdownItem label="Insumos" value={formatCurrency(suppliesCost)} />
              <BreakdownItem label="Mano de Obra" value={formatCurrency(laborCost)} icon={Clock} />
              <BreakdownItem label="Servicios" value={formatCurrency(servicesCost)} icon={Zap} />
              <BreakdownItem label="Extras" value={formatCurrency(extraCost)} icon={Box} />
              
              <div className="pt-2 mt-2 border-t border-slate-200">
                <div className="flex justify-between items-center bg-rose-50 p-3 rounded-xl border border-rose-100/30">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Precio Sug. (30% + Imp)</span>
                    <span className="text-sm font-black text-rose-600 tabular-nums">{formatCurrency(suggestedPrice)}</span>
                  </div>
                  <Info className="w-4 h-4 text-rose-200" />
                </div>
              </div>
            </motion.div>
          ) : showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 bg-rose-50/50 p-6 rounded-3xl mb-4 border border-rose-100/50"
            >
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-rose-400 border-b border-rose-100/50 pb-2 mb-2">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Preparación</span>
              </div>
              <div className="space-y-4 max-h-62.5 overflow-y-auto pr-2 custom-scrollbar">
                {(recipe.instructions || []).map((step, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center bg-rose-100 text-rose-600 font-bold rounded-full text-[10px]">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-slate-100/50"
            >
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Costo Producción</p>
                <p className="font-black text-lg text-slate-800 tabular-nums">{formatCurrency(totalCost)}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Costo x {recipe.yieldUnit || 'un'}</p>
                <p className="font-black text-lg text-rose-600 tabular-nums">{formatCurrency(costPerUnit)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
    </GlassCard>
  );
};

const BreakdownItem: React.FC<{ label: string; value: string; icon?: any }> = ({ label, value, icon: Icon }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-3 h-3 text-slate-300" />}
      <span className="text-[10px] font-black text-slate-500 uppercase">{label}</span>
    </div>
    <span className="text-xs font-black text-slate-700 tabular-nums">{value}</span>
  </div>
);
