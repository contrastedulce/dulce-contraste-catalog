import React from 'react';
import { Plus, FileText, Pencil, Trash2, Download, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { Quote, Product } from '../../types';

interface QuotesViewProps {
  quotes: Quote[];
  products: Product[];
  globalSearch: string;
  onAddQuote: () => void;
  onEditQuote: (quote: Quote) => void;
  onDeleteQuote: (id: string) => void;
  onDownloadPDF: (quote: Quote) => void;
  formatCurrency: (amount: number) => string;
}

export const QuotesView = React.memo<QuotesViewProps>(({
  quotes,
  products,
  globalSearch,
  onAddQuote,
  onEditQuote,
  onDeleteQuote,
  onDownloadPDF,
  formatCurrency
}) => {
  const filteredQuotes = quotes.filter(q => 
    (q.customerName || '').toLowerCase().includes(globalSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Cotizaciones</h2>
          <p className="text-slate-500 font-medium mt-1">Genera presupuestos profesionales y personalizados para tus clientes.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={onAddQuote}
          icon={Plus}
        >
          Nueva Cotización
        </Button>
      </div>

      {filteredQuotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredQuotes.map((quote, idx) => (
            <GlassCard 
              key={quote.id} 
              delay={idx * 0.05}
              className="group p-8 border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full rounded-3xl"
            >
              <div className="relative z-10 flex-1">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => onEditQuote(quote)}
                      className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 shadow-sm border border-slate-100 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDownloadPDF(quote)}
                      className="p-2.5 bg-white hover:bg-emerald-50 rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm border border-slate-100 transition-all"
                      title="Descargar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDeleteQuote(quote.id)}
                      className="p-2.5 bg-white hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 shadow-sm border border-slate-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-rose-600 transition-colors uppercase tracking-tight">{quote.customerName}</h3>
                  <div className="flex items-center gap-3 mt-3">
                     <Badge variant="slate">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(quote.date).toLocaleDateString()}
                    </Badge>
                     <Badge variant="rose">
                      ID: {quote.id}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-10">
                  {quote.items.map((item, iIdx) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={iIdx} className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-bold">
                          {product?.name || 'Producto'} <span className="text-slate-300 mx-1">/</span> {item.formatName} <span className="text-rose-600 ml-1">x{item.quantity}</span>
                        </span>
                        <span className="font-black text-slate-800 tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-100/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cotizado</p>
                  <p className="text-3xl font-black text-rose-600 tabular-nums">{formatCurrency(quote.total)}</p>
                </div>
                <button 
                   onClick={() => onDownloadPDF(quote)}
                   className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-rose-600/30 hover:bg-rose-700 transition-all active:scale-95"
                >
                  <Download className="w-6 h-6" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="py-24 text-center border-none shadow-sm" delay={0.2}>
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
              <FileText size={48} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">No hay cotizaciones activas</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
                Genera presupuestos en minutos para<br/>enviar a tus clientes vía WhatsApp o PDF.
              </p>
            </div>
            <Button onClick={onAddQuote} variant="primary" size="lg" icon={Plus}>
              Crear Presupuesto
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
});
