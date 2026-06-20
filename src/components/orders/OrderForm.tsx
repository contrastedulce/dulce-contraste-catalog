import React from 'react';
import { Plus, Trash2, Calendar, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Order, Product } from '../../types';

interface OrderFormProps {
  orderFormData: Partial<Order>;
  setOrderFormData: (data: any) => void;
  products: Product[];
  onSave: () => void;
  formatCurrency: (amount: number) => string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  orderFormData,
  setOrderFormData,
  products,
  onSave,
  formatCurrency
}) => {
  const [orderItemForm, setOrderItemForm] = React.useState({ productId: '', formatName: '', quantity: 1 });

  const handleAddItem = () => {
    const product = products.find(p => p.id === orderItemForm.productId);
    const format = product?.saleFormats.find(f => f.name === orderItemForm.formatName);
    if (product && format) {
      const newItem = {
        productId: product.id,
        formatName: format.name,
        quantity: orderItemForm.quantity,
        price: format.price
      };
      const newItems = [...(orderFormData.items || []), newItem];
      const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setOrderFormData({ ...orderFormData, items: newItems, total: newTotal });
      setOrderItemForm({ productId: '', formatName: '', quantity: 1 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipo Doc.</label>
          <select
            value={orderFormData.taxData?.documentType || 'nota'}
            onChange={(e) => setOrderFormData({ 
              ...orderFormData, 
              taxData: { ...(orderFormData.taxData || { documentNumber: '' }), documentType: e.target.value as any } 
            })}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all font-bold"
          >
            <option value="nota">Nota de Venta</option>
            <option value="boleta">Boleta (DNI)</option>
            <option value="factura">Factura (RUC)</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {orderFormData.taxData?.documentType === 'factura' ? 'RUC / Razón Social' : 'DNI / Nombre Cliente'}
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              value={orderFormData.customerName}
              onChange={(e) => setOrderFormData({ ...orderFormData, customerName: e.target.value })}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all font-bold"
              placeholder={orderFormData.taxData?.documentType === 'factura' ? "20123456789 - Empresa SAC" : "DNI - Nombre completo"}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Agregar Producto al Pedido</label>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-5">
            <select
              value={orderItemForm.productId}
              onChange={(e) => setOrderItemForm({ ...orderItemForm, productId: e.target.value, formatName: '' })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
            >
              <option value="">Seleccionar...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-4">
            <select
              value={orderItemForm.formatName}
              onChange={(e) => setOrderItemForm({ ...orderItemForm, formatName: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              disabled={!orderItemForm.productId}
            >
              <option value="">Formato...</option>
              {products.find(p => p.id === orderItemForm.productId)?.saleFormats.map(f => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <input
              type="number"
              value={orderItemForm.quantity}
              onChange={(e) => setOrderItemForm({ ...orderItemForm, quantity: parseInt(e.target.value) })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center font-bold"
              min="1"
            />
          </div>
          <div className="col-span-1">
            <button
              onClick={handleAddItem}
              className="w-full h-full flex items-center justify-center bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {(orderFormData.items || []).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-primary font-black text-xs">
                {item.quantity}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{products.find(p => p.id === item.productId)?.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{item.formatName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
              <button 
                onClick={() => {
                  const newItems = (orderFormData.items || []).filter((_, i) => i !== idx);
                  const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                  setOrderFormData({ ...orderFormData, items: newItems, total: newTotal });
                }}
                className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha de Entrega</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="date"
              value={orderFormData.deliveryDate || ''}
              onChange={(e) => setOrderFormData({ ...orderFormData, deliveryDate: e.target.value })}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all font-bold"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hora de Entrega</label>
          <input
            type="time"
            value={orderFormData.deliveryTime || ''}
            onChange={(e) => setOrderFormData({ ...orderFormData, deliveryTime: e.target.value })}
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</label>
          <select
            value={orderFormData.status}
            onChange={(e) => setOrderFormData({ ...orderFormData, status: e.target.value as any })}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all font-bold"
          >
            <option value="pending">Pendiente</option>
            <option value="preparing">En Preparación</option>
            <option value="delivered">Entregado (General)</option>
            <option value="delivered_credit">Entregado (Crédito)</option>
            <option value="delivered_paid">Entregado (Pagado)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</label>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xl font-black text-primary">{formatCurrency(orderFormData.total || 0)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        className="w-full py-4 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all shadow-xl active:scale-[0.98] uppercase tracking-widest"
      >
        Finalizar Pedido
      </button>
    </div>
  );
};
