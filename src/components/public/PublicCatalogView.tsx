import React, { useState, useMemo } from 'react';
import { ShoppingBag, ChevronRight, ChevronLeft, Plus, Minus, MessageCircle, BookOpen, CheckCircle2, Star, Clock, Zap, AlertCircle } from 'lucide-react';
import { Product, AppSettings } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  productId: string;
  formatName: string;
  productName: string;
  quantity: number;
  price: number;
  leadTime?: string;
  availability: 'in_stock' | 'on_order';
}

interface PublicCatalogViewProps {
  products: Product[];
  settings: AppSettings;
  formatCurrency: (amount: number) => string;
}

export const PublicCatalogView: React.FC<PublicCatalogViewProps> = ({
  products,
  settings,
  formatCurrency
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [direction, setDirection] = useState(0);
  const [hoveredFormatImage, setHoveredFormatImage] = useState<string | null>(null);

  const isAgendaClosed = settings.agendaStatus === 'closed';

  // Grouping and Page Logic
  const bookPages = useMemo(() => {
    const pages: { type: 'cover' | 'separator' | 'product'; data?: any }[] = [{ type: 'cover' }];
    
    // 1. Featured Section: "Disponibles Hoy"
    // A product is featured if ANY of its formats is in_stock
    const inStock = products.filter(p => p.saleFormats.some(f => f.availability === 'in_stock'));
    if (inStock.length > 0) {
      pages.push({ type: 'separator', data: 'Disponibles Hoy' });
      inStock.forEach(p => pages.push({ type: 'product', data: p }));
    }

    // 2. Regular Categories
    const categories = (Array.from(new Set(products.map(p => p.category || 'Otros'))) as string[]).sort((a, b) => {
      const order = ['Tortas', 'Tartas', 'Pasteles', 'Galletas', 'Salados'];
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    categories.forEach(cat => {
      const catProducts = products.filter(p => (p.category || 'Otros') === cat);
      if (catProducts.length > 0) {
        pages.push({ type: 'separator', data: cat });
        catProducts.forEach(p => {
          pages.push({ type: 'product', data: p });
        });
      }
    });

    return pages;
  }, [products]);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  const paginate = (newDirection: number) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 0 && newPage < bookPages.length) {
      setDirection(newDirection);
      setCurrentPage(newPage);
    }
  };

  const addToCart = (product: Product, format: any) => {
    if (isAgendaClosed && format.availability !== 'in_stock') {
      alert('Nuestra agenda de pedidos personalizados está cerrada por el momento. ¡Pero aún puedes pedir lo que tenemos disponible hoy!');
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id && i.formatName === format.name);
      if (existing) {
        return prev.map(i => (i.productId === product.id && i.formatName === format.name) 
          ? { ...i, quantity: i.quantity + 1 } 
          : i);
      }
      return [...prev, { 
        productId: product.id, 
        formatName: format.name, 
        productName: product.name, 
        quantity: 1, 
        price: format.price,
        leadTime: format.leadTime,
        availability: format.availability || 'on_order'
      }];
    });
  };

  const updateQuantity = (productId: string, formatName: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.productId === productId && i.formatName === formatName) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const sendToWhatsApp = () => {
    if (!customerName.trim()) {
      alert('Por favor, ingresa tu nombre para completar el pedido.');
      return;
    }

    const itemsText = cart.map(i => {
      const availabilityInfo = i.availability === 'in_stock' ? '(Disponible hoy)' : `(A pedido - ${i.leadTime || '48h'})`;
      return `- ${i.quantity}x ${i.productName} [${i.formatName}] ${availabilityInfo}: ${formatCurrency(i.price * i.quantity)}`;
    }).join('\n');

    const message = `Hola Dulce Contraste! 🧁\n\nMi nombre es *${customerName}* y me gustaría hacer el siguiente pedido:\n\n${itemsText}\n\n*Total: ${formatCurrency(cartTotal)}*\n\n¿Me confirmarían la disponibilidad? ¡Gracias!`;
    
    const phone = settings.whatsappPhone?.replace(/\D/g, '') || '51900000000';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    setIsOrderSent(true);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
    })
  };

  const activePage = bookPages[currentPage];

  if (isOrderSent) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6 text-center font-serif">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">¡Pedido Enviado!</h2>
          <p className="text-slate-500 font-bold max-w-sm mx-auto mb-8">
            Te hemos redirigido a WhatsApp para confirmar los detalles.
          </p>
          <button 
            onClick={() => { setCart([]); setIsOrderSent(false); setCustomerName(''); setCurrentPage(0); }}
            className="bg-slate-800 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl"
          >
            Cerrar Libro
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3F0] overflow-hidden flex flex-col items-center justify-center p-4 relative">
      {/* Dynamic Background Atmosphere */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentPage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {activePage?.type === 'cover' ? (
            <img src="/catalog_hero.png" className="w-full h-full object-cover blur-xl scale-110" alt="BG" />
          ) : activePage?.type === 'separator' ? (
            <div className={`w-full h-full blur-xl ${activePage.data === 'Disponibles Hoy' ? 'bg-emerald-900/40' : 'bg-rose-900/40'}`} />
          ) : (
            (hoveredFormatImage || activePage?.data?.image) ? (
              <img src={hoveredFormatImage || activePage.data.image} className="w-full h-full object-cover blur-xl scale-110" alt="BG" />
            ) : (
              <div className="w-full h-full bg-rose-500/20 blur-xl" />
            )
          )}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Agenda Banner Overlay */}
      {settings.agendaStatus && settings.agendaStatus !== 'open' && (
        <motion.div 
          initial={{ y: -50 }} animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-60 p-3 flex items-center justify-center gap-2 text-white font-black text-[10px] uppercase tracking-widest shadow-lg ${
            settings.agendaStatus === 'limited' ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        >
          <AlertCircle size={14} />
          {settings.agendaMessage || (settings.agendaStatus === 'limited' ? 'Cupos Limitados' : 'Agenda Llena por el momento')}
        </motion.div>
      )}

      {/* Book Container */}
      <div className="relative z-10 w-full max-w-4xl aspect-3/4 md:aspect-4/3 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] rounded-r-2xl overflow-hidden flex flex-col md:flex-row perspective-1000">
        
        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 z-20 flex items-center p-2 group">
          {currentPage > 0 && (
            <button onClick={() => paginate(-1)} className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-slate-400 hover:text-slate-800 transition-all hover:scale-110">
              <ChevronLeft size={24} />
            </button>
          )}
        </div>
        <div className="absolute inset-y-0 right-0 z-20 flex items-center p-2 group">
          {currentPage < bookPages.length - 1 && (
            <button onClick={() => paginate(1)} className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-slate-400 hover:text-slate-800 transition-all hover:scale-110">
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Pages */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {activePage?.type === 'cover' ? (
              <motion.div key="cover" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
                <div className="absolute inset-0">
                  <img src="/catalog_hero.png" className="w-full h-full object-cover" alt="Cover" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>
                <div className="relative h-full flex flex-col justify-center items-center text-center p-12 text-white">
                  <BookOpen size={64} className="text-rose-400 mb-8 drop-shadow-lg" />
                  <h1 className="text-6xl font-black mb-4 tracking-tighter drop-shadow-2xl">Dulce Contraste</h1>
                  <div className="w-24 h-1.5 bg-rose-400 mb-8 rounded-full shadow-lg" />
                  <p className="font-serif italic text-2xl mb-16 drop-shadow-md">"Dulzura artesanal en cada bocado"</p>
                  
                  {/* Status Indicator in Cover */}
                  {settings.agendaStatus === 'closed' && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl mb-12 max-w-sm">
                      <p className="text-xs font-black uppercase tracking-widest text-rose-300 mb-1 flex items-center justify-center gap-2">
                         <AlertCircle size={14} /> Agenda Cerrada
                      </p>
                      <p className="text-[10px] font-medium text-white/80 leading-relaxed italic">
                        {settings.agendaMessage || 'Estamos trabajando en pedidos previos. ¡Vuelve pronto!'}
                      </p>
                    </div>
                  )}

                  <button onClick={() => paginate(1)} className="group flex items-center gap-4 bg-rose-500 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-2xl active:scale-95">
                    Ver el Menú <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ) : activePage?.type === 'separator' ? (
              <motion.div key={`sep-${activePage.data}`} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-12 text-center">
                <div className="absolute inset-0 opacity-30">
                  <img src="/catalog_hero.png" className="w-full h-full object-cover grayscale" alt="Separator" />
                </div>
                <div className="relative border-2 border-rose-400/30 p-12 rounded-[40px] backdrop-blur-sm bg-black/20">
                  {activePage.data === 'Disponibles Hoy' ? (
                    <Zap className="text-emerald-400 mx-auto mb-6 animate-pulse" size={48} fill="currentColor" />
                  ) : (
                    <Star className="text-rose-400 mx-auto mb-6 animate-pulse" size={48} fill="currentColor" />
                  )}
                  <p className={`${activePage.data === 'Disponibles Hoy' ? 'text-emerald-400' : 'text-rose-400'} font-black text-sm uppercase tracking-[0.5em] mb-4`}>
                    {activePage.data === 'Disponibles Hoy' ? 'Tentaciones de Hoy' : 'Nuestra Selección de'}
                  </p>
                  <h2 className="text-6xl font-black text-white tracking-tighter">{activePage.data}</h2>
                  <div className={`w-32 h-1 ${activePage.data === 'Disponibles Hoy' ? 'bg-emerald-400' : 'bg-rose-400'} mx-auto mt-8 rounded-full`} />
                </div>
                <button onClick={() => paginate(1)} className="mt-12 text-white/50 hover:text-white transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                  Continuar leyendo <ChevronRight size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div key={`prod-${activePage?.data?.id}`} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="absolute inset-0 flex flex-col">
                <div className="absolute inset-0">
                  {(hoveredFormatImage || activePage?.data?.image) ? (
                    <img src={hoveredFormatImage || activePage.data.image} className="w-full h-full object-cover transition-all duration-700" alt={activePage.data.name} />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <ShoppingBag size={64} className="text-slate-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent" />
                </div>
                <div className="relative h-full flex flex-col justify-end p-6 md:p-12 text-white">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {activePage?.data?.category || 'Otros'}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight drop-shadow-lg">{activePage?.data?.name}</h2>
                    {activePage?.data?.description && <p className="text-white/90 font-serif italic text-lg leading-relaxed mb-8 drop-shadow-md max-w-lg">{activePage.data.description}</p>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activePage?.data?.saleFormats.map((format: any) => {
                        const inCart = cart.find(i => i.productId === activePage.data.id && i.formatName === format.name);
                        const isAvailable = format.availability === 'in_stock';
                        const formatLocked = isAgendaClosed && !isAvailable;

                        return (
                          <div 
                            key={format.name} 
                            onMouseEnter={() => format.image && setHoveredFormatImage(format.image)}
                            onMouseLeave={() => setHoveredFormatImage(null)}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              formatLocked ? 'bg-black/10 border-white/5 opacity-40' : 'bg-white/3 border-white/10 hover:bg-white/10 hover:border-white/30'
                            }`}
                          >
                            {format.image && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 mr-3 shadow-lg">
                                <img src={format.image} className="w-full h-full object-cover" alt="Format" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{format.name}</p>
                                {isAvailable ? (
                                  <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-0.5">
                                    <Zap size={8} fill="currentColor" /> Hoy
                                  </span>
                                ) : (
                                  <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-0.5">
                                    <Clock size={8} /> {format.leadTime || '48h'}
                                  </span>
                                )}
                              </div>
                              <p className="text-lg font-black tabular-nums">{formatCurrency(format.price)}</p>
                            </div>

                            {formatLocked ? (
                              <div className="text-right">
                                <p className="text-[8px] font-black text-rose-300 uppercase tracking-tighter">Agenda Llena</p>
                              </div>
                            ) : inCart ? (
                              <div className="flex items-center gap-3 bg-rose-500 px-3 py-1.5 rounded-xl shadow-lg">
                                <button onClick={() => updateQuantity(activePage.data.id, format.name, -1)} className="text-white hover:scale-125 transition-transform"><Minus size={14} /></button>
                                <span className="font-black text-white min-w-[15px] text-center">{inCart.quantity}</span>
                                <button onClick={() => updateQuantity(activePage.data.id, format.name, 1)} className="text-white hover:scale-125 transition-transform"><Plus size={14} /></button>
                              </div>
                            ) : (
                              <button onClick={() => addToCart(activePage.data, format)} className="p-3 bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 transition-all active:scale-90">
                                <Plus size={20} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-8 flex gap-2">
        {bookPages.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPage ? "w-8 bg-rose-400" : "w-1.5 bg-slate-200"}`} />
        ))}
      </div>
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full overflow-hidden">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Tu Selección ({cart.length})</p>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {cart.map(item => (
                    <div key={`${item.productId}-${item.formatName}`} className="shrink-0 bg-slate-50 px-4 py-2 rounded-full text-xs font-bold text-slate-600 flex items-center gap-2 border border-slate-100">
                      <span>{item.quantity}x {item.productName}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                  <p className="text-2xl font-black text-slate-800">{formatCurrency(cartTotal)}</p>
                </div>
                <div className="flex-1 md:flex-none">
                  <div className="relative flex items-center gap-3">
                    <input type="text" placeholder="Tu Nombre..." value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 w-48" />
                    <button onClick={sendToWhatsApp} className="bg-emerald-500 text-white p-4 rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center">
                      <MessageCircle size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
