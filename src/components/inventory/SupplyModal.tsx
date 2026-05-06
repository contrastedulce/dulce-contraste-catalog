import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { Supply } from '../../types';
import { safeNum } from '../../lib/utils';
import { Modal } from '../shared/Modal';

interface SupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplyData: any) => void;
  initialData: any;
  editingSupply: Supply | null;
}

export const SupplyModal: React.FC<SupplyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  editingSupply
}) => {
  const [formData, setFormData] = useState(initialData);
  const [packQty, setPackQty] = useState('');
  const [packContent, setPackContent] = useState('');
  const [packPrice, setPackPrice] = useState('');

  // Sync with initialData when modal opens or editingSupply changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setPackQty('');
      setPackContent('');
      setPackPrice('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleApplyPackCalculation = () => {
    const totalUnits = safeNum(packQty) * safeNum(packContent);
    if (totalUnits <= 0) return;

    const currentStock = safeNum(formData.stock);
    const newStockValue = editingSupply ? (currentStock + totalUnits) : totalUnits;
    const unitCost = packPrice ? (safeNum(packPrice) / totalUnits) : formData.cost;
    
    setFormData({
      ...formData,
      stock: newStockValue,
      cost: unitCost
    });
    
    setPackQty('');
    setPackContent('');
    setPackPrice('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSupply ? 'Editar Insumo' : 'Nuevo Insumo'}
      description={editingSupply ? 'Actualiza los datos del insumo seleccionado.' : 'Completa los datos para agregar un nuevo insumo.'}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre del Insumo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold"
              placeholder="Ej: Harina Blanca Flor"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unidad</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold"
              placeholder="Ej: kg, g, un"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold"
            >
              {['Secos', 'Lácteos', 'Frescos', 'Packaging', 'Importado'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 p-5 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Calculadora de Bultos / Packs</span>
              </div>
              <span className="text-[10px] text-gray-400 italic">Ayuda para calcular totales y costos</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Sacos/Cajas (Cant.)</label>
                <input 
                  type="number" 
                  value={packQty}
                  onChange={(e) => setPackQty(e.target.value)}
                  placeholder="Ej: 2"
                  className="w-full p-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Peso/Volumen c/u</label>
                <input 
                  type="number" 
                  value={packContent}
                  onChange={(e) => setPackContent(e.target.value)}
                  placeholder="Ej: 5000 (gr)"
                  className="w-full p-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Precio Total (S/.)</label>
                <input 
                  type="number" 
                  value={packPrice}
                  onChange={(e) => setPackPrice(e.target.value)}
                  placeholder="Ej: 180"
                  className="w-full p-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none font-bold"
                />
              </div>
            </div>
            <button 
              onClick={handleApplyPackCalculation}
              className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10 active:scale-95 flex items-center justify-center gap-2 border-none"
            >
              ✅ Calcular y Aplicar Costo Real
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Costo Unitario (Real)
              <span className="block text-[10px] lowercase font-medium text-amber-600 mt-0.5">* Precio por cada gramo/ml</span>
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Actual</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseFloat(e.target.value) })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold"
            />
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
              💡 **Dato clave**: El "Costo Unitario" es lo que cuesta **1 gramo** o **1 ml**. Usa la calculadora de arriba si solo sabes el precio del saco o bidón completo.
            </p>
        </div>

        <div className="flex gap-4 pt-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 py-4 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] border-none outline-none"
          >
            {editingSupply ? '💾 Guardar Cambios' : '✨ Crear Insumo'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
