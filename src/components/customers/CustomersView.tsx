import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, TrendingUp, Calendar, Hash, UserCircle2, ChevronDown, ChevronUp, FileText, Save, Check } from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { Customer, Product, Order } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface CustomersViewProps {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  globalSearch: string;
  formatCurrency: (amount: number) => string;
  onUpdateCustomer: (customer: Customer) => void;
}

const CustomerCard: React.FC<{
  customer: Customer;
  products: Product[];
  orders: Order[];
  formatCurrency: (amount: number) => string;
  onUpdateCustomer: (customer: Customer) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  idx: number;
}> = ({ customer, products, orders, formatCurrency, onUpdateCustomer, isExpanded, onToggleExpand, idx }) => {
  const [note, setNote] = useState(customer.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setNote(customer.notes || '');
  }, [customer.notes]);

  const handleSaveNote = () => {
    onUpdateCustomer({ ...customer, notes: note });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const customerOrders = orders.filter(o => o.customerName === customer.name).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const debtOrders = customerOrders.filter(o => o.status === 'delivered_credit');
  const totalDebt = debtOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  const debtByMonth = debtOrders.reduce((acc, o) => {
    const date = new Date(o.date);
    const month = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    acc[capitalizedMonth] = (acc[capitalizedMonth] || 0) + (o.total || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      <GlassCard className="group hover:scale-[1.01] transition-all duration-300 border-transparent hover:border-indigo-100 overflow-hidden bg-white/90">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                {customer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">{customer.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    ID: {customer.id}
                  </span>
                  {customer.totalSpent > 1000 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[10px] font-black text-amber-600 uppercase tracking-tighter shadow-sm shadow-amber-100">
                      VIP Cliente
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inversión Total</p>
              <p className="text-2xl font-black text-indigo-600">{formatCurrency(customer.totalSpent)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                <ShoppingBag size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pedidos</p>
                <p className="text-sm font-black text-slate-700">{customer.orderCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Última Vez</p>
                <p className="text-sm font-black text-slate-700">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                <Hash size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Favorito</p>
                <p className="text-sm font-black text-slate-700 truncate max-w-[80px]">
                  {customer.favoriteProducts?.length ? 
                    products.find(p => p.id === customer.favoriteProducts?.[0])?.name || 'Varios' 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 text-center">
            <button 
              onClick={onToggleExpand}
              className="w-full flex items-center justify-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-colors py-2"
            >
              {isExpanded ? (
                <>Ocultar Detalles <ChevronUp size={16} /></>
              ) : (
                <>Ver Historial y Notas <ChevronDown size={16} /></>
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300 space-y-6">
              {/* Notes Section */}
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Notas y Preferencias</h4>
                  <button 
                    onClick={handleSaveNote}
                    className={cn(
                      "p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest",
                      isSaved ? "bg-emerald-500 text-white" : "bg-white text-indigo-500 hover:bg-indigo-500 hover:text-white border border-indigo-200"
                    )}
                  >
                    {isSaved ? <Check size={12} /> : <Save size={12} />}
                    {isSaved ? 'Guardado' : 'Guardar'}
                  </button>
                </div>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Escribe algo sobre este cliente (preferencias, alergias, etc)..."
                  className="w-full bg-white/50 border-none focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-3 text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none h-24"
                />
              </div>

              {totalDebt > 0 && (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-rose-500" />
                    <h4 className="font-black text-rose-800 text-sm uppercase tracking-widest">Deuda Pendiente: {formatCurrency(totalDebt)}</h4>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(debtByMonth).map(([month, amount]) => (
                      <div key={month} className="flex justify-between items-center text-sm font-bold text-rose-700/80">
                        <span>{month}</span>
                        <span>{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-3 text-left">Historial de Pedidos</h4>
                <div className="space-y-2 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
                  {customerOrders.length > 0 ? customerOrders.map(order => (
                    <div key={order.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                      <div className="text-left">
                        <p className="font-bold text-sm text-slate-800">{new Date(order.date).toLocaleDateString()}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {order.status === 'delivered_credit' ? 'Crédito' : order.status === 'delivered_paid' || order.status === 'delivered' ? 'Pagado' : 'En Curso'}
                        </p>
                      </div>
                      <p className="font-black text-slate-800">{formatCurrency(order.total || 0)}</p>
                    </div>
                  )) : (
                    <p className="text-sm font-bold text-slate-400 text-center py-4">No hay pedidos registrados.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const CustomersView: React.FC<CustomersViewProps> = ({ 
  customers, 
  products, 
  orders,
  globalSearch: externalSearch,
  formatCurrency,
  onUpdateCustomer
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const search = localSearch || externalSearch;

  // Build a consolidated customer list from orders
  const consolidatedCustomers = React.useMemo(() => {
    const customerMap = new Map<string, Customer>();

    // First add all explicitly saved customers
    customers.forEach(c => {
      customerMap.set(c.name.toLowerCase().trim(), { ...c, totalSpent: 0, orderCount: 0 });
    });

    // Then process all orders to build accurate stats
    orders.forEach(order => {
      const nameKey = (order.customerName || '').toLowerCase().trim();
      if (!nameKey) return;

      const total = order.total || 0;
      
      if (!customerMap.has(nameKey)) {
        customerMap.set(nameKey, {
          id: Math.random().toString(36).substr(2, 9),
          name: order.customerName,
          totalSpent: total,
          orderCount: 1,
          lastOrderDate: order.date,
          favoriteProducts: order.items.map(i => i.productId).slice(0, 5),
          notes: ''
        });
      } else {
        const c = customerMap.get(nameKey)!;
        c.totalSpent += total;
        c.orderCount += 1;
        if (new Date(order.date) > new Date(c.lastOrderDate)) {
          c.lastOrderDate = order.date;
        }
      }
    });

    return Array.from(customerMap.values());
  }, [customers, orders]);

  const filteredCustomers = consolidatedCustomers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  ).sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));

  const stats = {
    total: consolidatedCustomers.length,
    highValue: consolidatedCustomers.filter(c => (c.totalSpent || 0) > 1000).length,
    avgSpent: consolidatedCustomers.length ? consolidatedCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / consolidatedCustomers.length : 0
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="bg-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
              <Users className="text-white" size={28} />
            </div>
            Gestión de Clientes (CRM)
          </h2>
          <p className="text-slate-500 font-medium mt-1">Conoce mejor a quienes aman tus preparaciones</p>
        </div>

        <div className="flex gap-4">
          <GlassCard className="px-6 py-4 flex items-center gap-4 bg-white/60">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <UserCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Clientes</p>
              <p className="text-xl font-black text-slate-800">{stats.total}</p>
            </div>
          </GlassCard>
          <GlassCard className="px-6 py-4 flex items-center gap-4 bg-white/60">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Promedio Compra</p>
              <p className="text-xl font-black text-slate-800">{formatCurrency(stats.avgSpent)}</p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Search Bar */}
      <GlassCard className="p-2 flex items-center gap-4 bg-white/80 sticky top-4 z-20 shadow-xl shadow-slate-200/50">
        <div className="pl-4 text-slate-400">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Buscar clientes por nombre o teléfono..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="flex-1 p-3 bg-transparent border-none focus:ring-0 font-bold text-slate-700 text-lg placeholder:text-slate-300"
        />
      </GlassCard>

      {/* Customers List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredCustomers.map((customer, idx) => (
          <CustomerCard 
            key={customer.id}
            customer={customer}
            products={products}
            orders={orders}
            formatCurrency={formatCurrency}
            onUpdateCustomer={onUpdateCustomer}
            isExpanded={expandedCustomer === customer.id}
            onToggleExpand={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
            idx={idx}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
            <Users size={40} />
          </div>
          <h3 className="text-lg font-black text-slate-800">No se encontraron clientes</h3>
          <p className="text-slate-400 font-bold mt-2">Los clientes se crean automáticamente cuando registras pedidos.</p>
        </div>
      )}
    </div>
  );
};
