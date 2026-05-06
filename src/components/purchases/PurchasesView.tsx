import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  Sparkles, 
  Clock, 
  Search 
} from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { Badge } from '../shared/Badge';
import { cn } from '../../lib/utils';
import { Purchase } from '../../types';

interface PurchasesViewProps {
  purchases: Purchase[];
  globalSearch: string;
  isProcessingReceipt: boolean;
  aiCooldown: number;
  onUploadReceipt: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatCurrency: (amt: number) => string;
}

export const PurchasesView = React.memo<PurchasesViewProps>(({
  purchases,
  globalSearch,
  isProcessingReceipt,
  aiCooldown,
  onUploadReceipt,
  formatCurrency
}) => {
  return (
    <motion.div
      key="purchases"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="space-y-8 max-w-7xl mx-auto z-10 relative"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800 uppercase">Compras</h2>
          <p className="text-slate-500 font-medium mt-1">Sube tus boletas y actualiza tu stock automáticamente.</p>
        </div>
        <div className="flex items-center gap-4">
          <label 
            className={cn(
              "cursor-pointer bg-primary-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 uppercase text-xs tracking-widest",
              (isProcessingReceipt || aiCooldown > 0) && "opacity-55 cursor-not-allowed pointer-events-none grayscale-[0.5]"
            )}
          >
            <div className="flex items-center gap-2 pointer-events-none">
              {isProcessingReceipt ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : aiCooldown > 0 ? (
                <div className="text-sm font-black bg-white/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {aiCooldown}s
                </div>
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>
                {isProcessingReceipt ? 'Procesando...' : aiCooldown > 0 ? 'Esperando...' : 'Subir Boleta (IA)'}
              </span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={onUploadReceipt}
              disabled={isProcessingReceipt || aiCooldown > 0}
            />
          </label>
        </div>
      </div>

      <GlassCard className="p-0 border-none shadow-sm overflow-hidden" delay={0.2}>
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md">
          <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Historial de Compras</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Proveedor</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Detalle</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {purchases.filter(p => 
                (p.supplierName || '').toLowerCase().includes(globalSearch.toLowerCase())
              ).map((purchase) => (
                <tr key={purchase.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 text-sm font-black text-slate-500 tabular-nums">{purchase.date}</td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 uppercase tracking-tight">{purchase.supplierName}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <Badge variant="slate" className="bg-slate-100 text-slate-600 border-none">
                      {purchase.items.length} productos
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-slate-800 tabular-nums">
                    {formatCurrency(purchase.total)}
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                      <ShoppingCart size={40} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">No hay compras registradas</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sube tu primera boleta para empezar.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
});
