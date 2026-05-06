import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { MemoizedLineChart, ChartErrorBoundary } from '../shared/Charts';
import { cn } from '../../lib/utils';

interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  suppliesExpense: number;
  laborExpense: number;
  equipmentExpense: number;
  netProfit: number;
}

interface FinancesViewProps {
  summary: FinanceSummary;
  mockSalesData: any[];
  formatCurrency: (amount: number) => string;
}

export const FinancesView = React.memo<FinancesViewProps>(({
  summary,
  mockSalesData,
  formatCurrency
}) => {
  const marginPercentage = summary.totalIncome > 0 
    ? (summary.netProfit / summary.totalIncome) * 100 
    : 0;

  const expensesBreakdown = [
    { label: 'Insumos', value: summary.suppliesExpense, color: 'bg-rose-500', icon: DollarSign },
    { label: 'Mano de Obra', value: summary.laborExpense, color: 'bg-blue-500', icon: DollarSign },
    { label: 'Equipos', value: summary.equipmentExpense, color: 'bg-amber-500', icon: DollarSign },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Finanzas</h2>
          <p className="text-slate-500 font-medium mt-1">Análisis de rentabilidad, costos operativos y flujo de caja.</p>
        </div>
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-fit shadow-inner border border-slate-100/50">
          <button className="px-8 py-2.5 rounded-xl font-black text-xs transition-all uppercase tracking-widest bg-white text-rose-600 shadow-xl shadow-slate-200/50">Mensual</button>
          <button className="px-8 py-2.5 rounded-xl font-black text-xs transition-all uppercase tracking-widest text-slate-400 hover:text-slate-600">Trimestral</button>
          <button className="px-8 py-2.5 rounded-xl font-black text-xs transition-all uppercase tracking-widest text-slate-400 hover:text-slate-600">Anual</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard className="p-8 border-none shadow-sm relative overflow-hidden group" delay={0.1}>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ingresos Totales</p>
            <h3 className="text-3xl font-black text-slate-800 tabular-nums">{formatCurrency(summary.totalIncome)}</h3>
            <div className="flex items-center gap-2 mt-4 text-emerald-600 font-black text-xs uppercase tracking-widest">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12.5% vs mes ant.</span>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 text-emerald-500/5 group-hover:scale-110 transition-transform duration-700">
            <TrendingUp size={120} />
          </div>
        </GlassCard>

        <GlassCard className="p-8 border-none shadow-sm relative overflow-hidden group" delay={0.2}>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gastos Operativos</p>
            <h3 className="text-3xl font-black text-slate-800 tabular-nums">{formatCurrency(summary.totalExpenses)}</h3>
            <div className="flex items-center gap-2 mt-4 text-rose-600 font-black text-xs uppercase tracking-widest">
              <ArrowDownRight className="w-4 h-4" />
              <span>+4.2% vs mes ant.</span>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 text-rose-500/5 group-hover:scale-110 transition-transform duration-700">
            <TrendingDown size={120} />
          </div>
        </GlassCard>

        <GlassCard className="p-8 border-none shadow-sm bg-linear-to-br from-rose-500 to-rose-600 relative overflow-hidden group" delay={0.3}>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-rose-100 uppercase tracking-widest mb-2">Utilidad Estimada</p>
            <h3 className="text-3xl font-black text-white tabular-nums">{formatCurrency(summary.netProfit)}</h3>
            <div className="flex items-center gap-2 mt-4 text-rose-100 font-black text-xs uppercase tracking-widest">
              <PieChart className="w-4 h-4" />
              <span>{marginPercentage.toFixed(1)}% Margen Neto</span>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 text-white/10 group-hover:scale-110 transition-transform duration-700">
            <DollarSign size={120} />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-10 border-none shadow-sm" delay={0.4}>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-800">Evolución Comercial</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Ventas brutas mensuales</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div className="h-80 relative">
            <ChartErrorBoundary>
              <MemoizedLineChart data={mockSalesData} color="#f43f5e" />
            </ChartErrorBoundary>
          </div>
        </GlassCard>

        <GlassCard className="p-10 border-none shadow-sm flex flex-col" delay={0.5}>
          <h3 className="text-2xl font-black text-slate-800 mb-10">Distribución de Gastos</h3>
          <div className="space-y-8 flex-1">
            {expensesBreakdown.map((item, i) => (
              <div key={i} className="group/item">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="font-black text-slate-800 text-lg tabular-nums">{formatCurrency(item.value)}</p>
                  </div>
                  <p className="text-xs font-black text-slate-400">{summary.totalExpenses > 0 ? ((item.value / summary.totalExpenses) * 100).toFixed(0) : 0}%</p>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: summary.totalExpenses > 0 ? `${(item.value / summary.totalExpenses) * 100}%` : '0%' }}
                    transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                    className={cn("h-full rounded-full shadow-sm", item.color)} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center leading-relaxed">
              Los gastos incluyen compras directas (boletas)<br/>y costos de producción de pedidos entregados.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
});
