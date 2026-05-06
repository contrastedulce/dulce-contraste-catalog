import React from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  AlertTriangle, 
  ChefHat, 
  BarChart3, 
  FileText, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard } from './StatCard';
import { MemoizedLineChart, ChartErrorBoundary } from '../shared/Charts';
import { GlassCard } from '../shared/GlassCard';
import { ProductionPlanningCard } from './ProductionPlanningCard';
import { cn } from '../../lib/utils';
import { Supply, Order } from '../../types';

interface DashboardViewProps {
  supplies: Supply[];
  orders: Order[];
  formatCurrency: (amount: number) => string;
  setActiveTab: (tab: string) => void;
  setInventoryFilter: (filter: 'all' | 'critical') => void;
  showNotification: (msg: string, type: 'success' | 'info') => void;
  mockSalesData: any[];
  recipes: any[];
  products: any[];
}

export const DashboardView = React.memo<DashboardViewProps>(({
  supplies,
  orders,
  formatCurrency,
  setActiveTab,
  setInventoryFilter,
  showNotification,
  mockSalesData,
  recipes,
  products
}) => {
  const criticalSuppliesCount = supplies.filter(s => s.stock <= s.minStock).length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Panel de Control</h2>
          <p className="text-slate-500 font-medium mt-1">Bienvenido de nuevo, Chef. Aquí tienes el resumen de hoy.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('finances')}
            className="p-3 glass-morphism rounded-2xl hover:bg-slate-50 transition-all active:scale-95 text-slate-500 hover:text-primary-600 border border-slate-100/50"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => showNotification('Generando reporte PDF...', 'info')}
            className="p-3 glass-morphism rounded-2xl hover:bg-slate-50 transition-all active:scale-95 text-slate-500 hover:text-primary-600 border border-slate-100/50"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="Ventas del Día" 
          value={formatCurrency(235.00)} 
          change="+12.5%" 
          trend="up"
          icon={TrendingUp}
          color="emerald"
          onClick={() => setActiveTab('finances')}
          delay={0.1}
        />
        <StatCard 
          title="Por Cobrar (Crédito)" 
          value={formatCurrency(orders.filter(o => o.status === 'delivered_credit').reduce((sum, o) => sum + (o.total || 0), 0))} 
          change="Deuda pendiente" 
          trend="neutral"
          icon={FileText}
          color="amber"
          onClick={() => setActiveTab('orders')}
          delay={0.15}
        />
        <StatCard 
          title="Pedidos Activos" 
          value={orders.filter(o => o.status === 'pending' || o.status === 'preparing').length} 
          change="+2 nuevos" 
          trend="up"
          icon={ShoppingCart}
          color="blue"
          onClick={() => setActiveTab('orders')}
          delay={0.2}
        />
        <StatCard 
          title="Insumos Críticos" 
          value={criticalSuppliesCount} 
          change={criticalSuppliesCount > 0 ? "Revisar stock" : "Todo en orden"} 
          trend={criticalSuppliesCount > 0 ? "down" : "neutral"}
          icon={AlertTriangle}
          color="rose"
          onClick={() => {
            setActiveTab('inventory');
            setInventoryFilter('critical');
          }}
          delay={0.3}
        />
        <StatCard 
          title="Producción Hoy" 
          value="45 kg" 
          change="85% completado" 
          trend="up"
          icon={ChefHat}
          color="purple"
          onClick={() => setActiveTab('recipes')}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8 border-none shadow-sm" delay={0.5}>
          <div className="flex items-center justify-between mb-10">
            <div 
              className="cursor-pointer group/title"
              onClick={() => setActiveTab('finances')}
            >
              <h3 className="font-black text-xl text-slate-800 group-hover/title:text-rose-600 transition-colors flex items-center gap-2">
                Rendimiento Semanal
                <ChevronRight className="w-5 h-5 opacity-0 group-hover/title:opacity-100 transition-all -translate-x-2 group-hover/title:translate-x-0" />
              </h3>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Ingresos por ventas</p>
            </div>
            <div className="flex bg-slate-100/50 p-1 rounded-xl">
              <button className="px-5 py-2 text-xs font-black bg-white shadow-sm rounded-lg text-rose-600">7D</button>
              <button className="px-5 py-2 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors">30D</button>
            </div>
          </div>
          <div className="h-80 relative">
            <ChartErrorBoundary>
              <MemoizedLineChart data={mockSalesData} color="#f43f5e" />
            </ChartErrorBoundary>
          </div>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col border-none shadow-sm" delay={0.6}>
          <div className="flex items-center justify-between mb-10">
            <div 
              className="cursor-pointer group/title"
              onClick={() => setActiveTab('orders')}
            >
              <h3 className="font-black text-xl text-slate-800 group-hover/title:text-rose-600 transition-colors flex items-center gap-2">
                Pedidos
                <ChevronRight className="w-5 h-5 opacity-0 group-hover/title:opacity-100 transition-all -translate-x-2 group-hover/title:translate-x-0" />
              </h3>
            </div>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-rose-600 hover:bg-rose-50 p-2.5 rounded-xl transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
            {orders.slice(0, 5).map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm font-black",
                    order.status === 'pending' ? "bg-amber-100 text-amber-600" :
                    order.status === 'preparing' ? "bg-blue-100 text-blue-600" :
                    "bg-emerald-100 text-emerald-600"
                  )}>
                    {order.status === 'pending' ? <Clock className="w-6 h-6" /> :
                     order.status === 'preparing' ? <ChefHat className="w-6 h-6" /> :
                     <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-800">{order.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{formatCurrency(order.total)}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-all translate-x-0 group-hover:translate-x-1" />
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className="w-full mt-8 py-4 text-xs font-black text-rose-600 bg-rose-50/50 hover:bg-rose-600 hover:text-white rounded-2xl transition-all active:scale-95 uppercase tracking-widest block"
          >
            Ver todos los pedidos
          </button>
        </GlassCard>

        <ProductionPlanningCard 
          orders={orders}
          recipes={recipes}
          products={products}
          supplies={supplies}
          setActiveTab={setActiveTab}
        />
      </div>

      {criticalSuppliesCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-100 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 group relative overflow-hidden shadow-xl shadow-amber-100/20"
        >
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-xl shadow-amber-200/20 group-hover:scale-110 transition-transform duration-500">
              <AlertTriangle className="w-10 h-10 animate-pulse-soft" />
            </div>
            <div>
              <h4 className="font-black text-2xl text-amber-900 tracking-tight">Alerta de Stock Crítico</h4>
              <p className="text-sm text-amber-700/80 font-bold mt-1">Hay {criticalSuppliesCount} insumos por debajo del mínimo. Reponer pronto.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setActiveTab('inventory');
              setInventoryFilter('critical');
            }}
            className="bg-amber-600 text-white px-10 py-4 rounded-2xl text-sm font-black hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/30 whitespace-nowrap active:scale-95 flex items-center gap-2 relative z-10 uppercase tracking-widest"
          >
            Gestionar Stock
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </motion.div>
      )}
    </div>
  );
});
