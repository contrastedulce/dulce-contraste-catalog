import React from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Palette,
  Shield,
  Calculator,
  Clock,
  Zap,
  Droplets,
  Flame,
  Home,
  Wrench,
  Percent,
  MessageCircle,
  Phone,
  Copy,
  Eye,
  Truck,
  MapPin,
  Plus,
  Trash2,
  Globe
} from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { AppSettings, MasterCosts } from '../../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const SettingsView = React.memo<SettingsViewProps>(({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onResetData
}) => {
  const updateMasterCosts = (updates: Partial<MasterCosts>) => {
    onUpdateSettings({
      ...settings,
      masterCosts: { ...settings.masterCosts, ...updates }
    });
  };

  const updateSalary = (type: 'heavy' | 'light', updates: Partial<MasterCosts['salaries']['heavy']>) => {
    onUpdateSettings({
      ...settings,
      masterCosts: {
        ...settings.masterCosts,
        salaries: {
          ...settings.masterCosts.salaries,
          [type]: { ...settings.masterCosts.salaries[type], ...updates }
        }
      }
    });
  };

  const updateService = (type: keyof MasterCosts['services'], updates: Partial<MasterCosts['services']['electricity']>) => {
    onUpdateSettings({
      ...settings,
      masterCosts: {
        ...settings.masterCosts,
        services: {
          ...settings.masterCosts.services,
          [type]: { ...settings.masterCosts.services[type], ...updates }
        }
      }
    });
  };

  const updateTaxes = (field: keyof MasterCosts['taxes'], value: number) => {
    onUpdateSettings({
      ...settings,
      masterCosts: {
        ...settings.masterCosts,
        taxes: { ...settings.masterCosts.taxes, [field]: value }
      }
    });
  };

  const updateKwhPrice = (value: number) => {
    onUpdateSettings({
      ...settings,
      masterCosts: {
        ...settings.masterCosts,
        kwhPrice: value
      }
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800 uppercase">Configuración</h2>
          <p className="text-slate-500 font-medium mt-1">Personaliza tu entorno de trabajo y gestiona tu información.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Localization & Appearance */}
        <GlassCard className="p-10 border-none shadow-sm space-y-8" delay={0.1}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Apariencia</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Sabor visual y moneda</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Moneda del Sistema</label>
              <select 
                value={settings.currency}
                onChange={(e) => onUpdateSettings({ ...settings, currency: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50/50 border-none rounded-2xl font-black text-slate-700 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none"
              >
                <option value="PEN">Soles (S/)</option>
                <option value="USD">Dólares ($)</option>
                <option value="ARS">Pesos (AR$)</option>
                <option value="MXN">Pesos (MX$)</option>
                <option value="EUR">Euros (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Color de Marca</label>
              <div className="flex gap-4 p-5 bg-slate-50/30 rounded-3xl border border-slate-100/50 justify-center">
                {['#F27D26', '#E11D48', '#059669', '#2563EB', '#7C3AED'].map(color => (
                  <button
                    key={color}
                    onClick={() => onUpdateSettings({ ...settings, primaryColor: color })}
                    className="w-10 h-10 rounded-full border-4 border-white transition-all hover:scale-125 shadow-lg active:scale-95"
                    style={{ 
                      backgroundColor: color,
                      boxShadow: settings.primaryColor === color ? `0 0 20px ${color}66` : 'none',
                      transform: settings.primaryColor === color ? 'scale(1.2)' : 'scale(1)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Master Costing - Salaries & Taxes */}
        <GlassCard className="p-10 border-none shadow-sm space-y-8" delay={0.2}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-sm">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Planilla e Impuestos</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Estructura base de salarios y tasas</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Sueldo Pesada (Mensual)" 
                type="number"
                value={settings.masterCosts.salaries.heavy.monthly || 0}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateSalary('heavy', { monthly: isNaN(val) ? 0 : val });
                }}
              />
              <Input 
                label="Horas Mes" 
                type="number"
                value={settings.masterCosts.salaries.heavy.hoursPerMonth || 0}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateSalary('heavy', { hoursPerMonth: isNaN(val) ? 0 : val });
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Sueldo Ligera (Mensual)" 
                type="number"
                value={settings.masterCosts.salaries.light.monthly || 0}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateSalary('light', { monthly: isNaN(val) ? 0 : val });
                }}
              />
              <Input 
                label="Horas Mes" 
                type="number"
                value={settings.masterCosts.salaries.light.hoursPerMonth || 0}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateSalary('light', { hoursPerMonth: isNaN(val) ? 0 : val });
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <Input 
                label="IGV (%)" 
                type="number"
                icon={Percent}
                value={settings.masterCosts.taxes.igv || 0}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateTaxes('igv', isNaN(val) ? 0 : val);
                }}
              />
              <Input 
                label="Imp. Venta (%)" 
                type="number"
                icon={Percent}
                value={settings.masterCosts.taxes.salesTax || 0}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateTaxes('salesTax', isNaN(val) ? 0 : val);
                }}
              />
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Input 
                label="Costo por kWh" 
                type="number"
                value={settings.masterCosts.kwhPrice || 0}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateKwhPrice(isNaN(val) ? 0 : val);
                }}
                icon={Zap}
              />
            </div>
          </div>
        </GlassCard>

        {/* Master Costing - Services */}
        <GlassCard className="p-10 border-none shadow-sm space-y-8 col-span-full" delay={0.3}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Servicios e Indirectos</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Montos mensuales y porcentaje de atribución al negocio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
            <ServiceInput 
              label="Electricidad" 
              icon={Zap} 
              monthly={settings.masterCosts.services.electricity.monthly}
              percent={settings.masterCosts.services.electricity.usagePercent}
              onChange={(m, p) => updateService('electricity', { monthly: m, usagePercent: p })}
            />
            <ServiceInput 
              label="Agua" 
              icon={Droplets} 
              monthly={settings.masterCosts.services.water.monthly}
              percent={settings.masterCosts.services.water.usagePercent}
              onChange={(m, p) => updateService('water', { monthly: m, usagePercent: p })}
            />
            <ServiceInput 
              label="Gas" 
              icon={Flame} 
              monthly={settings.masterCosts.services.gas.monthly}
              percent={settings.masterCosts.services.gas.usagePercent}
              onChange={(m, p) => updateService('gas', { monthly: m, usagePercent: p })}
            />
            <ServiceInput 
              label="Alquiler" 
              icon={Home} 
              monthly={settings.masterCosts.services.rent.monthly}
              percent={settings.masterCosts.services.rent.usagePercent}
              onChange={(m, p) => updateService('rent', { monthly: m, usagePercent: p })}
            />
            <ServiceInput 
              label="Maquinaria" 
              icon={Wrench} 
              monthly={settings.masterCosts.services.machinery.monthly}
              percent={settings.masterCosts.services.machinery.usagePercent}
              onChange={(m, p) => updateService('machinery', { monthly: m, usagePercent: p })}
            />
            <ServiceInput 
              label="Utensilios" 
              icon={Clock} 
              monthly={settings.masterCosts.services.utensils.monthly}
              percent={settings.masterCosts.services.utensils.usagePercent}
              onChange={(m, p) => updateService('utensils', { monthly: m, usagePercent: p })}
            />
          </div>
        </GlassCard>

        {/* Data Security */}
        <GlassCard className="p-10 border-none shadow-sm space-y-8" delay={0.4}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Datos</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Seguridad y copias</p>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onExportData}
              className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white rounded-4xl transition-all group border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 shadow-sm transition-colors">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-700">Exportar Backup</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Respaldo total .json</p>
                </div>
              </div>
            </button>

            <label className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white rounded-4xl transition-all group border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 shadow-sm transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-700">Importar Backup</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Restaurar datos .json</p>
                </div>
              </div>
              <input type="file" accept=".json" className="hidden" onChange={onImportData} />
            </label>

            <div className="pt-6 border-t border-slate-100">
              <button 
                onClick={onResetData}
                className="w-full flex items-center justify-between p-6 bg-rose-50/50 hover:bg-rose-600 rounded-4xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-400 group-hover:text-rose-600 shadow-sm">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-rose-600 group-hover:text-white transition-colors">Borrar Todo</p>
                    <p className="text-[10px] font-black text-rose-300 group-hover:text-rose-100 uppercase tracking-widest transition-colors">Acción Irreversible</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Public Catalog Settings */}
        <div className="space-y-8 col-span-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-10 border-none shadow-sm space-y-8" delay={0.5}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Catálogo Público</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Configuración de pedidos por WhatsApp</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input 
                  label="WhatsApp del Negocio" 
                  placeholder="Ej: 51900000000"
                  value={settings.whatsappPhone || ''}
                  onChange={(e) => onUpdateSettings({ ...settings, whatsappPhone: e.target.value })}
                  icon={Phone}
                />

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado de la Agenda</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['open', 'limited', 'closed'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => onUpdateSettings({ ...settings, agendaStatus: status })}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          (settings.agendaStatus || 'open') === status
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'open' ? 'bg-emerald-500' : 
                          status === 'limited' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-center">
                          {status === 'open' ? 'Abierta' : 
                          status === 'limited' ? 'Limitada' : 'Llena'}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aviso para Clientes:</p>
                    <input
                      type="text"
                      value={settings.agendaMessage || ''}
                      onChange={(e) => onUpdateSettings({ ...settings, agendaMessage: e.target.value })}
                      placeholder="Ej: Agenda llena para el fin de semana..."
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Links de Tu Catálogo:</p>

                  {/* Local link */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">🌐 Local (Red Interna)</span>
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] font-bold text-indigo-800 bg-white/50 px-3 py-2 rounded-xl flex-1 break-all">
                        {window.location.origin}/?view=catalog
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/?view=catalog`);
                          alert('¡Link copiado!');
                        }}
                        className="p-2.5 bg-white text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm border border-indigo-100"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Production link */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                      <Globe size={10} /> Producción (Clientes)
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] font-bold text-emerald-800 bg-emerald-50/50 px-3 py-2 rounded-xl flex-1 break-all border border-emerald-100">
                        https://contrastedulce.github.io/dulce-contraste-catalog/
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('https://contrastedulce.github.io/dulce-contraste-catalog/');
                          alert('¡Link copiado!');
                        }}
                        className="p-2.5 bg-white text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-100"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open('https://contrastedulce.github.io/dulce-contraste-catalog/', '_blank')}
                    className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    Ver Mi Catálogo Público
                  </button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-10 border-none shadow-sm space-y-8" delay={0.5}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shadow-sm">
                  <Palette className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Colores por Profesor</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Distingue las recetas de cada profesor con un color</p>
                </div>
              </div>

              <div className="space-y-3">
                {(settings.professorColors || []).map((prof, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <input
                      type="color"
                      value={prof.color}
                      onChange={(e) => {
                        const list = [...(settings.professorColors || [])];
                        list[idx] = { ...list[idx], color: e.target.value };
                        onUpdateSettings({ ...settings, professorColors: list });
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 bg-white p-1"
                      title="Cambiar color"
                    />
                    <input
                      type="text"
                      value={prof.name}
                      onChange={(e) => {
                        const list = [...(settings.professorColors || [])];
                        list[idx] = { ...list[idx], name: e.target.value };
                        onUpdateSettings({ ...settings, professorColors: list });
                      }}
                      className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <button
                      onClick={() => {
                        const list = (settings.professorColors || []).filter((_, i) => i !== idx);
                        onUpdateSettings({ ...settings, professorColors: list });
                      }}
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      title="Eliminar profesor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const list = [...(settings.professorColors || []), { name: 'Nuevo Profesor', color: '#64748b' }];
                    onUpdateSettings({ ...settings, professorColors: list });
                  }}
                  className="w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all flex items-center justify-center gap-2 border-2 border-dashed border-purple-200"
                >
                  <Plus size={14} />
                  Agregar Profesor
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-10 border-none shadow-sm space-y-8" delay={0.6}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
                  <Truck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Configuración de Delivery</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Gestión de zonas y umbral de envío gratis</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Envío Gratis a partir de (S/)</label>
                  <input 
                    type="number"
                    value={settings.freeDeliveryThreshold || ''}
                    onChange={(e) => onUpdateSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                    placeholder="Ej: 150"
                    className="w-full px-5 py-4 bg-emerald-50/30 border-none rounded-2xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <p className="text-[10px] text-emerald-600 italic mt-2 ml-1">Deja en 0 si no ofreces envío gratis.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zonas de Entrega</label>
                    <button 
                      onClick={() => {
                        const zones = settings.deliveryZones || [];
                        onUpdateSettings({ 
                          ...settings, 
                          deliveryZones: [...zones, { name: 'Nueva Zona', cost: 0 }] 
                        });
                      }}
                      className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Añadir Zona
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(settings.deliveryZones || []).length === 0 ? (
                      <div className="text-center p-8 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-400">No hay zonas configuradas</p>
                      </div>
                    ) : (
                      (settings.deliveryZones || []).map((zone, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm group space-y-3">
                          <div className="flex gap-2 items-center">
                            <MapPin size={16} className="text-slate-300" />
                            <input 
                              type="text"
                              value={zone.name}
                              onChange={(e) => {
                                const zones = [...settings.deliveryZones];
                                zones[idx].name = e.target.value;
                                onUpdateSettings({ ...settings, deliveryZones: zones });
                              }}
                              className="flex-1 bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0 p-0 uppercase tracking-widest"
                              placeholder="Nombre de la ruta"
                            />
                            <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-black text-slate-400 mr-1">S/</span>
                              <input 
                                type="number"
                                value={zone.cost}
                                onChange={(e) => {
                                  const zones = [...settings.deliveryZones];
                                  zones[idx].cost = parseFloat(e.target.value) || 0;
                                  onUpdateSettings({ ...settings, deliveryZones: zones });
                                }}
                                className="w-12 bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0 p-0"
                              />
                            </div>
                            <button 
                              onClick={() => {
                                const zones = settings.deliveryZones.filter((_, i) => i !== idx);
                                onUpdateSettings({ ...settings, deliveryZones: zones });
                              }}
                              className="p-2 text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <input 
                            type="text"
                            value={zone.description || ''}
                            onChange={(e) => {
                              const zones = [...settings.deliveryZones];
                              zones[idx].description = e.target.value;
                              onUpdateSettings({ ...settings, deliveryZones: zones });
                            }}
                            className="w-full bg-slate-50/50 border-none text-[10px] font-medium text-slate-500 focus:ring-0 px-3 py-2 rounded-xl italic"
                            placeholder="Urb. Angamos, Santa Isabel, El Chilcal..."
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
});

interface ServiceInputProps {
  label: string;
  icon: any;
  monthly: number;
  percent: number;
  onChange: (monthly: number, percent: number) => void;
}

const ServiceInput: React.FC<ServiceInputProps> = ({ 
  label, 
  icon: Icon, 
  monthly, 
  percent, 
  onChange 
}) => (
  <div className="space-y-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group hover:bg-white transition-all hover:shadow-md">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{label}</span>
    </div>
    <div className="space-y-3">
      <Input 
        label="Mensual" 
        type="number" 
        value={monthly || 0} 
        onChange={(e) => {
          const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
          onChange(isNaN(val) ? 0 : val, percent);
        }}
        className="text-xs"
        compact
      />
      <Input 
        label="% Uso" 
        type="number" 
        value={percent || 0} 
        onChange={(e) => {
          const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
          onChange(monthly, isNaN(val) ? 0 : val);
        }}
        className="text-xs"
        icon={Percent}
        compact
      />
    </div>
  </div>
);
