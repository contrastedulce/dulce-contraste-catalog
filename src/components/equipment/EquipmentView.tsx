import React from 'react';
import { Plus, Wrench, Pencil, Trash2, Clock, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { Equipment } from '../../types';

interface EquipmentViewProps {
  equipment: Equipment[];
  globalSearch: string;
  onAddEquipment: () => void;
  onEditEquipment: (eq: Equipment) => void;
  onDeleteEquipment: (id: string) => void;
  calculateHourlyCost: (e: Equipment) => number;
  formatCurrency: (amount: number) => string;
}

export const EquipmentView = React.memo<EquipmentViewProps>(({
  equipment,
  globalSearch,
  onAddEquipment,
  onEditEquipment,
  onDeleteEquipment,
  calculateHourlyCost,
  formatCurrency
}) => {
  const filteredEquipment = equipment.filter(e => 
    (e.name || '').toLowerCase().includes(globalSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Equipamiento</h2>
          <p className="text-slate-500 font-medium mt-1">Gestión de activos, depreciación y costos operativos por hora.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={onAddEquipment}
          icon={Plus}
        >
          Nuevo Equipo
        </Button>
      </div>

      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEquipment.map((eq, idx) => {
            const hourlyCost = calculateHourlyCost(eq);
            return (
              <GlassCard 
                key={eq.id} 
                delay={idx * 0.05}
                className="group p-8 border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-3xl"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 border border-slate-100">
                      <Wrench className="w-8 h-8" />
                    </div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => onEditEquipment(eq)}
                        className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 shadow-sm border border-slate-100 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteEquipment(eq.id)}
                        className="p-2.5 bg-white hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 shadow-sm border border-slate-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-10">
                    <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-amber-600 transition-colors uppercase tracking-tight">{eq.name}</h3>
                    <div className="flex items-center gap-2 mt-3">
                       <Badge variant="slate">
                        <Clock className="w-3 h-3 mr-1" />
                        {eq.operatingHoursMonthly} Horas/Mes
                      </Badge>
                       <Badge variant="amber">
                        <Zap className="w-3 h-3 mr-1" />
                        Mant: {formatCurrency(eq.maintenanceCostMonthly)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100/50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión (Valor)</p>
                      <p className="text-xl font-black text-slate-800 tabular-nums">{formatCurrency(eq.purchasePrice)}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Costo Operativo</p>
                      <p className="text-2xl font-black text-amber-600 tabular-nums">{formatCurrency(hourlyCost)} <span className="text-[10px] font-black uppercase text-amber-500/50">/ hr</span></p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="py-24 text-center border-none shadow-sm" delay={0.2}>
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
              <Wrench size={48} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">No hay equipos registrados</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
                Registra tus maquinarias para calcular<br/>los costos ocultos por hora de uso.
              </p>
            </div>
            <Button onClick={onAddEquipment} variant="primary" size="lg" icon={Plus}>
              Agregar Equipo
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
});
