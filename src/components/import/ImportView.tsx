import React, { useEffect, useMemo, useState } from 'react';
import {
  Upload, Search, CheckCircle2, AlertCircle, Plus, RefreshCw,
  ChevronDown, ChevronRight, FileText, User, Loader2, Info, X, Sparkles
} from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { cn } from '../../lib/utils';

// ---------- Tipos ----------
interface IngredienteExtraido {
  cantidad: number | null;
  unidad: string | null;
  nombre: string;
  insumoId: string | null;
}

interface RecetaExtraida {
  id: string;
  nombre: string;
  tipo: 'completa' | 'sub' | 'por-clasificar';
  autor: string | null;
  pdf: string;
  ingredientes: IngredienteExtraido[];
  pasos: string[];
  componentes: string[];
  estado: 'nueva' | 'coincide' | 'similar';
  coincideCon?: { id: string; name: string; author?: string | null };
}

interface VistaPrevia {
  generado: string;
  totalPdfs: number;
  procesados: number;
  totales: {
    total: number;
    completas: number;
    subs: number;
    porClasificar: number;
    nuevas: number;
    coinciden: number;
    similares: number;
  };
  autores: string[];
  recetas: RecetaExtraida[];
}

const POR_PAGINA = 60;

export const ImportView: React.FC<{ professorColors?: { name: string; color: string }[] }> = ({ professorColors = [] }) => {
  const [datos, setDatos] = useState<VistaPrevia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<{ actualizadas: number; agregadas: number; totalRecetas: number } | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [filtroAutor, setFiltroAutor] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [soloSeleccionables, setSoloSeleccionables] = useState(false);

  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [expandida, setExpandida] = useState<string | null>(null);
  // Cambios locales de nombre y tipo
  const [cambios, setCambios] = useState<Record<string, { nombre?: string; tipo?: RecetaExtraida['tipo'] }>>({});
  const [pagina, setPagina] = useState(1);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const r = await fetch('/api/import/preview');
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Error al cargar');
      setDatos(d);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const colorDe = (autor: string | null) => {
    if (!autor) return '#94a3b8';
    const norm = (s: string) => s.toLowerCase().trim();
    const m = professorColors.find((p) => norm(p.name).includes(norm(autor)) || norm(autor).includes(norm(p.name)));
    return m?.color || '#94a3b8';
  };

  const nombreFinal = (r: RecetaExtraida) => cambios[r.id]?.nombre ?? r.nombre;
  const tipoFinal = (r: RecetaExtraida) => cambios[r.id]?.tipo ?? r.tipo;

  const filtradas = useMemo(() => {
    if (!datos) return [];
    const q = busqueda.toLowerCase().trim();
    return datos.recetas.filter((r) => {
      if (filtroAutor && r.autor !== filtroAutor) return false;
      if (filtroTipo && tipoFinal(r) !== filtroTipo) return false;
      if (filtroEstado && r.estado !== filtroEstado) return false;
      if (soloSeleccionables && r.estado === 'coincide') return false;
      if (!q) return true;
      return (
        nombreFinal(r).toLowerCase().includes(q) ||
        (r.autor || '').toLowerCase().includes(q) ||
        r.pdf.toLowerCase().includes(q) ||
        r.ingredientes.some((i) => i.nombre.toLowerCase().includes(q))
      );
    });
  }, [datos, busqueda, filtroAutor, filtroTipo, filtroEstado, soloSeleccionables, cambios]);

  const visibles = filtradas.slice(0, pagina * POR_PAGINA);

  const alternar = (id: string) => {
    setSeleccion((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });
  };

  const seleccionarVisibles = () => {
    setSeleccion((prev) => {
      const nuevo = new Set(prev);
      visibles.forEach((r) => nuevo.add(r.id));
      return nuevo;
    });
  };

  const limpiarSeleccion = () => setSeleccion(new Set());

  const importar = async () => {
    if (!datos || seleccion.size === 0) return;
    const confirmar = window.confirm(
      `¿Importar ${seleccion.size} recetas?\n\n` +
      `• Las que coinciden con una receta existente se ACTUALIZAN (mismo ID, no se duplican)\n` +
      `• Las nuevas se AGREGAN\n` +
      `• NO se elimina ninguna receta existente\n\n` +
      `Se recomienda tener un respaldo de la base de datos.`
    );
    if (!confirmar) return;

    setImportando(true);
    setResultado(null);
    try {
      const recetas = datos.recetas
        .filter((r) => seleccion.has(r.id))
        .map((r) => ({
          ...r,
          nombre: nombreFinal(r),
          tipo: tipoFinal(r),
        }));
      const resp = await fetch('/api/import/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recetas }),
      });
      const d = await resp.json();
      if (!resp.ok) throw new Error(d.error || 'Error al importar');
      setResultado(d);
      setSeleccion(new Set());
      await cargar();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setImportando(false);
    }
  };

  // ---------- Render ----------
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-500 font-bold">Analizando la extracción de PDFs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-10 border-none shadow-sm text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-black text-slate-800">No se pudo cargar la extracción</h3>
        <p className="text-slate-500 text-sm">{error}</p>
        <Button onClick={cargar} variant="primary" icon={RefreshCw}>Reintentar</Button>
      </GlassCard>
    );
  }

  if (!datos) return null;

  const t = datos.totales;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800 flex items-center gap-3">
            <Upload className="w-9 h-9 text-primary" />
            Importar desde PDFs
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Revisa y aprueba antes de incorporar a la app. Nada se importa sin tu confirmación.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={cargar}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm"
            title="Recargar extracción"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Button
            onClick={importar}
            variant="primary"
            icon={importando ? Loader2 : Upload}
            disabled={seleccion.size === 0 || importando}
          >
            {importando ? 'Importando...' : `Importar ${seleccion.size || ''}`.trim()}
          </Button>
        </div>
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-emerald-800">Importación completada</p>
            <p className="text-sm text-emerald-700 mt-1">
              <b>{resultado.actualizadas}</b> recetas actualizadas · <b>{resultado.agregadas}</b> nuevas agregadas
              · Total en la app: <b>{resultado.totalRecetas}</b>
            </p>
          </div>
          <button onClick={() => setResultado(null)} className="ml-auto text-emerald-600 hover:text-emerald-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total extraídas', valor: t.total, color: 'text-slate-800', bg: 'bg-slate-50' },
          { label: 'Completas', valor: t.completas, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Sub-recetas', valor: t.subs, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Por clasificar', valor: t.porClasificar, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Nuevas', valor: t.nuevas, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Ya existen', valor: t.coinciden, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((c) => (
          <div key={c.label} className={cn('rounded-2xl p-4 border border-white shadow-sm', c.bg)}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{c.label}</p>
            <p className={cn('text-2xl font-black mt-1 tabular-nums', c.color)}>{c.valor}</p>
          </div>
        ))}
      </div>

      {/* Barra de filtros */}
      <GlassCard className="p-5 border-none shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              placeholder="Buscar receta, ingrediente, PDF o profesora..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <select
            value={filtroAutor}
            onChange={(e) => { setFiltroAutor(e.target.value); setPagina(1); }}
            className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
          >
            <option value="">Todas las profesoras</option>
            {datos.autores.map((a) => <option key={a} value={a}>{a}</option>)}
            <option value="">(sin profesora)</option>
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => { setFiltroTipo(e.target.value); setPagina(1); }}
            className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
          >
            <option value="">Todos los tipos</option>
            <option value="completa">Receta completa</option>
            <option value="sub">Sub-receta</option>
            <option value="por-clasificar">Por clasificar</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { v: '', l: 'Todas' },
            { v: 'nueva', l: 'Nuevas' },
            { v: 'coincide', l: 'Ya existen' },
            { v: 'similar', l: 'Similares' },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => { setFiltroEstado(f.v); setPagina(1); }}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all',
                filtroEstado === f.v ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              )}
            >
              {f.l}
            </button>
          ))}
          <div className="h-5 w-px bg-slate-200 mx-1" />
          <button onClick={seleccionarVisibles} className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
            Seleccionar visibles ({visibles.length})
          </button>
          <button onClick={limpiarSeleccion} className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 hover:bg-slate-200">
            Limpiar
          </button>
          <span className="ml-auto text-xs font-bold text-slate-400">
            {filtradas.length} resultados · {seleccion.size} seleccionadas
          </span>
        </div>
      </GlassCard>

      {/* Lista */}
      <div className="space-y-2">
        {visibles.map((r) => {
          const marcada = seleccion.has(r.id);
          const abierta = expandida === r.id;
          const color = colorDe(r.autor);
          const tipo = tipoFinal(r);
          const nombre = nombreFinal(r);
          const editado = !!cambios[r.id];

          return (
            <div
              key={r.id}
              className={cn(
                'bg-white rounded-2xl border transition-all overflow-hidden',
                marcada ? 'border-primary/40 shadow-md' : 'border-slate-100 shadow-sm hover:shadow-md'
              )}
            >
              <div className="flex items-start gap-3 p-4">
                <input
                  type="checkbox"
                  checked={marcada}
                  onChange={() => alternar(r.id)}
                  className="w-5 h-5 mt-1 accent-primary cursor-pointer rounded"
                />
                <div className="w-1.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: color }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      value={nombre}
                      onChange={(e) => setCambios((c) => ({ ...c, [r.id]: { ...c[r.id], nombre: e.target.value } }))}
                      className={cn(
                        'font-black text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary outline-none px-0.5 min-w-[200px] flex-1',
                        editado && 'text-primary'
                      )}
                    />
                    <select
                      value={tipo}
                      onChange={(e) => setCambios((c) => ({ ...c, [r.id]: { ...c[r.id], tipo: e.target.value as any } }))}
                      className={cn(
                        'text-[10px] font-black uppercase tracking-wider rounded-full px-2.5 py-1 border cursor-pointer',
                        tipo === 'completa' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : tipo === 'sub' ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      )}
                    >
                      <option value="completa">Completa</option>
                      <option value="sub">Sub-receta</option>
                      <option value="por-clasificar">Por clasificar</option>
                    </select>

                    {r.estado === 'coincide' && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200" title={`Coincide con: ${r.coincideCon?.name}`}>
                        Ya existe
                      </span>
                    )}
                    {r.estado === 'similar' && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200" title={`Similar a: ${r.coincideCon?.name}`}>
                        Similar
                      </span>
                    )}
                    {r.estado === 'nueva' && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        Nueva
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-bold flex-wrap">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{r.autor || 'Sin profesora'}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{r.pdf}</span>
                    <span>{r.ingredientes.length} ing.</span>
                    <span>{r.pasos.length} pasos</span>
                    {r.componentes.length > 0 && <span className="text-purple-500">{r.componentes.length} componentes</span>}
                  </div>
                </div>

                <button
                  onClick={() => setExpandida(abierta ? null : r.id)}
                  className="p-2 text-slate-400 hover:text-primary transition-colors shrink-0"
                >
                  {abierta ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>

              {abierta && (
                <div className="px-4 pb-4 pl-[3.75rem] grid grid-cols-1 lg:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Ingredientes ({r.ingredientes.length})
                    </p>
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
                      {r.ingredientes.map((i, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span className="w-14 text-right font-black text-slate-400 tabular-nums shrink-0">
                            {i.cantidad ?? '—'}
                          </span>
                          <span className="w-12 text-[10px] font-black uppercase text-slate-400 shrink-0">
                            {i.unidad || ''}
                          </span>
                          <span className={cn('truncate', i.insumoId ? 'text-slate-700' : 'text-amber-600')}>
                            {i.nombre}
                          </span>
                          {i.insumoId && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" /> = vinculado al catálogo de insumos
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Preparación ({r.pasos.length})
                    </p>
                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2">
                      {r.pasos.map((p, idx) => (
                        <p key={idx} className="text-xs text-slate-600 leading-relaxed">
                          <span className="font-black text-slate-300 mr-1">{idx + 1}.</span>{p}
                        </p>
                      ))}
                      {r.pasos.length === 0 && <p className="text-xs text-slate-400 italic">Sin pasos registrados</p>}
                    </div>
                    {r.componentes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Se compone de</p>
                        <div className="flex flex-wrap gap-1">
                          {r.componentes.map((c) => (
                            <span key={c} className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {visibles.length < filtradas.length && (
        <div className="text-center pt-4">
          <Button onClick={() => setPagina((p) => p + 1)} variant="secondary" icon={ChevronDown}>
            Ver más ({filtradas.length - visibles.length} restantes)
          </Button>
        </div>
      )}

      {filtradas.length === 0 && (
        <GlassCard className="p-16 border-none shadow-sm text-center">
          <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-black text-slate-600">No hay recetas con esos filtros</p>
        </GlassCard>
      )}

      {seleccion.size > 0 && (
        <div className="sticky bottom-6 z-30 flex justify-center pointer-events-none">
          <div className="pointer-events-auto bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="font-black text-sm">{seleccion.size} recetas seleccionadas</span>
            <button
              onClick={importar}
              disabled={importando}
              className="bg-primary hover:bg-primary-600 px-5 py-2 rounded-xl font-black text-sm transition-all disabled:opacity-50"
            >
              {importando ? 'Importando...' : 'Importar ahora'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
