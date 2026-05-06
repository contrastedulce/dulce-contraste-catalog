import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Clock, 
  User, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Timer,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { cn } from '../../lib/utils';
import { Order } from '../../types';

interface OrdersViewProps {
  orders: Order[];
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
  selectedOrders: string[];
  onToggleSelection: (id: string) => void;
  onToggleAllSelection: (ids: string[]) => void;
  onAddOrder: () => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  onDeleteBulk: () => void;
  onImportIA: () => void;
  onUploadReceipt: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessingReceipt: boolean;
  aiCooldown: number;
  formatCurrency: (amount: number) => string;
}

export const OrdersView = React.memo<OrdersViewProps>(({
  orders,
  globalSearch,
  setGlobalSearch,
  selectedOrders,
  onToggleSelection,
  onToggleAllSelection,
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
  onDeleteBulk,
  onImportIA,
  onUploadReceipt,
  isProcessingReceipt,
  aiCooldown,
  formatCurrency
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.customerName || '').toLowerCase().includes(globalSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'delivered_paid') return o.status === 'delivered' || o.status === 'delivered_paid';
    return o.status === statusFilter;
  });

  const isAllSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;
  const handleToggleAll = () => {
    if (isAllSelected) {
      onToggleAllSelection([]);
    } else {
      onToggleAllSelection(filteredOrders.map(o => o.id));
    }
  };

  const stats = [
    { label: 'Pendientes', count: orders.filter(o => o.status === 'pending').length, color: 'amber', filterValue: 'pending' },
    { label: 'En Preparación', count: orders.filter(o => o.status === 'preparing').length, color: 'blue', filterValue: 'preparing' },
    { label: 'Crédito', count: orders.filter(o => o.status === 'delivered_credit').length, color: 'rose', filterValue: 'delivered_credit' },
    { label: 'Pagados', count: orders.filter(o => o.status === 'delivered' || o.status === 'delivered_paid').length, color: 'emerald', filterValue: 'delivered_paid' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Pedidos</h2>
          <p className="text-slate-500 font-medium mt-1">Gestión del flujo de trabajo y seguimiento de entregas.</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {selectedOrders.length > 0 && (
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
                  Eliminar ({selectedOrders.length})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            variant="secondary" 
            onClick={onImportIA}
            disabled={aiCooldown > 0}
            icon={Sparkles}
          >
            {aiCooldown > 0 ? `Esperando (${aiCooldown}s)` : 'Importar con IA'}
          </Button>
          <label 
            className={cn(
              "cursor-pointer bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 text-[10px] uppercase tracking-widest",
              (isProcessingReceipt || aiCooldown > 0) && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            {isProcessingReceipt ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : <Sparkles className="w-4 h-4" />}
            <span>{isProcessingReceipt ? 'Analizando...' : 'Boleta (IA)'}</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={onUploadReceipt}
              disabled={isProcessingReceipt || aiCooldown > 0}
            />
          </label>
          <Button 
            variant="primary" 
            onClick={onAddOrder}
            icon={Plus}
          >
            Nuevo Pedido
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const isActive = statusFilter === s.filterValue;
          return (
            <GlassCard 
              key={s.label} 
              delay={i * 0.05} 
              className={cn(
                "p-6 border-2 shadow-sm transition-all",
                isActive ? (
                  s.color === 'amber' ? 'border-amber-400 bg-amber-50/50' : 
                  s.color === 'blue' ? 'border-blue-400 bg-blue-50/50' : 
                  s.color === 'rose' ? 'border-rose-400 bg-rose-50/50' : 'border-emerald-400 bg-emerald-50/50'
                ) : "border-transparent hover:border-slate-200"
              )}
              onClick={() => setStatusFilter(isActive ? 'all' : s.filterValue)}
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <h4 className={cn(
                "text-3xl font-black tabular-nums",
                s.color === 'amber' ? "text-amber-600" : 
                s.color === 'blue' ? "text-blue-600" : 
                s.color === 'rose' ? "text-rose-600" : "text-emerald-600"
              )}>
                {s.count}
                <span className="text-xs text-slate-400 ml-2 font-bold uppercase tracking-tighter">Pedidos</span>
              </h4>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="p-0 border-none shadow-sm overflow-hidden" delay={0.2}>
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="text" 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Buscar clientes por nombre..." 
              className="w-full max-sm:w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          
          <div className="px-4 py-2 bg-slate-100/50 rounded-xl border border-slate-100/50 hidden md:block">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Registrados: <span className="text-rose-600 ml-1">{orders.length}</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="w-12 px-8 py-5">
                  <input 
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleAll}
                    className="w-5 h-5 rounded-lg border-slate-200 text-rose-600 focus:ring-rose-500/20 transition-all cursor-pointer"
                  />
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className={cn(
                  "hover:bg-slate-50/50 transition-colors group",
                  selectedOrders.includes(order.id) ? "bg-rose-50/30" : ""
                )}>
                  <td className="px-8 py-6">
                    <input 
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => onToggleSelection(order.id)}
                      className="w-5 h-5 rounded-lg border-slate-200 text-rose-600 focus:ring-rose-500/20 transition-all cursor-pointer"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 border border-slate-100 group-hover:scale-110 transition-transform">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 leading-tight">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{order.id} | {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <Badge 
                        variant={order.status === 'pending' ? 'amber' : order.status === 'preparing' ? 'blue' : order.status === 'delivered_credit' ? 'rose' : 'emerald'}
                      >
                        {order.status === 'pending' ? 'Pendiente' : order.status === 'preparing' ? 'Preparando' : order.status === 'delivered_credit' ? 'Crédito' : order.status === 'delivered_paid' ? 'Pagado' : 'Entregado'}
                      </Badge>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Update 2h ago</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-black text-slate-800 tabular-nums">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditOrder(order)}
                        className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => onDeleteOrder(order.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                <ShoppingCart size={40} />
              </div>
              <h3 className="text-lg font-black text-slate-800">No hay pedidos registrados</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sincroniza tus chats o crea un pedido manualmente.</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
});
