import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, MessageCircle, Star, Clock, Zap, AlertCircle, ChefHat, Calendar, ChevronRight, X, ArrowDown, CheckCircle2, Truck, MapPin, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, AppSettings, Recipe } from '../../types';

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
  recipes: Recipe[];
  formatCurrency: (amount: number) => string;
}

export const PublicCatalogView: React.FC<PublicCatalogViewProps> = ({
  products,
  settings,
  recipes,
  formatCurrency
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [customCake, setCustomCake] = useState<{ base?: string, filling?: string, cover?: string }>({});
  const [activeStep, setActiveStep] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [gpsLocation, setGpsLocation] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [isLocating, setIsLocating] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedZone, setSelectedZone] = useState<{ name: string, cost: number, description?: string } | null>(null);

  // Ubicación de Dulce Contraste (Urb. Angamos)
  const BUSINESS_COORDS = { lat: -5.183803, lng: -80.631881 };

  // Fallback zones if settings are empty
  const zones = (settings.deliveryZones && settings.deliveryZones.length > 0) ? settings.deliveryZones : [
    { name: 'Corazón de Azúcar (Locales)', cost: 5, description: 'Angamos, Santa Isabel, San Eduardo, El Chilcal, Piura, Av. Country/Cáceres' },
    { name: 'Expreso Dulce (Intermedio)', cost: 10, description: 'Centro, Miraflores, Los Geranios, UDEP, Mall Plaza, Cayetano Heredia' },
    { name: 'Horizonte Pastelero (Alejados)', cost: 15, description: 'Los Ejidos, 26 de Octubre, Miraflores Country Club, Enace' }
  ];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
  };

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsLocation(`https://www.google.com/maps?q=${latitude},${longitude}`);
        
        // Auto-seleccionar zona basada en distancia
        const distance = calculateDistance(BUSINESS_COORDS.lat, BUSINESS_COORDS.lng, latitude, longitude);
        
        if (distance <= 2.2) { // 2km + margen
          setSelectedZone(zones[0]);
        } else if (distance <= 5.5) { // 5km + margen
          setSelectedZone(zones[1]);
        } else {
          setSelectedZone(zones[2]);
        }

        setIsLocating(false);
        alert(`¡Ubicación fijada! Estás a aprox. ${distance.toFixed(1)} km de nosotros. 📍`);
      },
      () => {
        alert('No pudimos obtener tu ubicación. Por favor escríbela manualmente.');
        setIsLocating(false);
      }
    );
  };

  const isAgendaClosed = settings.agendaStatus === 'closed';

  const activeProducts = useMemo(() => products.filter(p => p.isActive !== false), [products]);

  // Logic to group products
  const groupedCategories = useMemo(() => {
    const sections: { title: string; items: any[]; type: 'regular' | 'featured' | 'star' }[] = [];
    
    // 0. Star Section: "Sugerencias del Chef" (Featured)
    const featured = activeProducts.filter(p => p.isFeatured);
    if (featured.length > 0) {
      const items = featured.map(p => ({ type: 'product', data: p }));
      sections.push({ title: 'Sugerencias del Chef', items, type: 'star' });
    }

    // 1. Featured Section: "Disponibles Hoy"
    const inStock = activeProducts.filter(p => p.saleFormats.some(f => f.availability === 'in_stock') && !p.isFeatured);
    if (inStock.length > 0) {
      const inStockGroups: Record<string, Product[]> = {};
      inStock.forEach(p => {
        const groupName = p.categoryGroup || p.name;
        if (!inStockGroups[groupName]) inStockGroups[groupName] = [];
        inStockGroups[groupName].push(p);
      });

      const items = Object.entries(inStockGroups).map(([groupName, groupProducts]) => {
        const hasExplicitGroup = groupProducts.some(p => !!p.categoryGroup);
        if (groupProducts.length === 1 && !hasExplicitGroup) {
          return { type: 'product', data: groupProducts[0] };
        }
        return { 
          type: 'productGroup', 
          data: { 
            name: groupName, 
            products: groupProducts,
            image: groupProducts[0].image,
            description: groupProducts[0].description,
            category: groupProducts[0].category || 'Otros'
          } 
        };
      });
      sections.push({ title: 'Disponibles Hoy', items, type: 'featured' });
    }

    // 2. Regular Categories (Excluding featured ones to avoid duplication)
    const nonFeatured = activeProducts.filter(p => !p.isFeatured);
    const categories = (Array.from(new Set(nonFeatured.map(p => p.category || 'Otros'))) as string[]).sort((a, b) => {
      const order = ['Tortas', 'Tartas', 'Pasteles', 'Galletas', 'Bocaditos Dulces y Salados', 'Salados'];
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    categories.forEach(cat => {
      const catProducts = nonFeatured.filter(p => (p.category || 'Otros') === cat);
      if (catProducts.length > 0) {
        const groups: Record<string, Product[]> = {};
        catProducts.forEach(p => {
          const groupName = p.categoryGroup || p.name;
          if (!groups[groupName]) groups[groupName] = [];
          groups[groupName].push(p);
        });

        const items = Object.entries(groups).map(([groupName, groupProducts]) => {
          const hasExplicitGroup = groupProducts.some(p => !!p.categoryGroup);
          if (groupProducts.length === 1 && !hasExplicitGroup) {
            return { type: 'product', data: groupProducts[0] };
          }
          return { 
            type: 'productGroup', 
            data: { 
              name: groupName, 
              products: groupProducts,
              image: groupProducts[0].image,
              description: groupProducts[0].description,
              category: cat
            } 
          };
        });
        sections.push({ title: cat, items, type: 'regular' });
      }
    });

    return sections;
  }, [activeProducts]);

  const addToCart = (product: Product, format: any) => {
    if (isAgendaClosed && format.availability !== 'in_stock') {
      alert('Nuestra agenda de pedidos personalizados está cerrada por el momento. ¡Pero aún puedes pedir lo que tenemos disponible hoy!');
      return;
    }

    const price = (product.discountPrice ? (product.discountPrice * (format.multiplier || 1)) : format.price);

    const item: CartItem = {
      productId: product.id,
      formatName: format.name,
      productName: product.name,
      quantity: 1,
      price: price,
      leadTime: format.leadTime,
      availability: format.availability
    };

    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.formatName === item.formatName);
      if (existing) {
        return prev.map(i => (i.productId === item.productId && i.formatName === item.formatName) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (productId: string, formatName: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.formatName === formatName) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isFreeDelivery = settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold;
  const deliveryCost = deliveryMethod === 'pickup' ? 0 : (isFreeDelivery ? 0 : (selectedZone?.cost || 0));
  const cartTotal = subtotal + deliveryCost;

  const sendOrder = async () => {
    if (!customerName.trim()) {
      alert('Por favor dinos tu nombre para el pedido');
      return;
    }
    if (!deliveryDate) {
      alert('Por favor selecciona una fecha de entrega');
      return;
    }
    if (deliveryMethod === 'delivery') {
      if (!selectedZone) {
        alert('Por favor selecciona tu zona de entrega');
        return;
      }
      if (!deliveryAddress.trim()) {
        alert('Por favor indícanos tu dirección de entrega');
        return;
      }
    }

    const isPickup = deliveryMethod === 'pickup';
    const orderText = `Hola Dulce Contraste! Mi nombre es ${customerName}. Me gustaría realizar este pedido:
${cart.map(i => `- ${i.productName} (${i.formatName}) x${i.quantity}: ${formatCurrency(i.price * i.quantity)}`).join('\n')}

Subtotal: ${formatCurrency(subtotal)}
${isPickup
  ? 'Modalidad: 🏪 RECOJO EN TIENDA (Gratis)'
  : `Delivery (${selectedZone?.name}): ${isFreeDelivery ? '¡GRATIS!' : formatCurrency(deliveryCost)}`
}
Total: ${formatCurrency(cartTotal)}

Fecha: ${deliveryDate} ${deliveryTime ? `a las ${deliveryTime}` : ''}
${isPickup
  ? 'Recogeré en: Urb. Angamos, Piura'
  : `Dirección: ${deliveryAddress}\n${gpsLocation ? `Ubicación GPS: ${gpsLocation}` : ''}`
}
---
Pedido generado desde el catálogo web.`;

    const encodedText = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/${settings.whatsappPhone}?text=${encodedText}`;
    
    try {
      await fetch('/api/public/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          items: cart,
          total: cartTotal,
          deliveryDate,
          deliveryTime,
          deliveryAddress: deliveryMethod === 'pickup' ? 'RECOJO EN TIENDA - Urb. Angamos, Piura' : deliveryAddress,
          deliveryZone: deliveryMethod === 'pickup' ? '🏪 Recojo en Tienda' : selectedZone?.name,
          gpsLocation: deliveryMethod === 'pickup' ? '' : gpsLocation,
          taxData: { documentType: 'boleta' }
        })
      });
    } catch (e) {
      console.error("Error logging order:", e);
    }

    window.open(whatsappUrl, '_blank');
    setIsOrderSent(true);
    setCart([]);
  };

  const renderProduct = (item: any) => {
    const isGroup = item.type === 'productGroup';
    const groupData = item.data;
    const productsInGroup = isGroup ? groupData.products : [groupData];
    
    // State for variants in this specific card
    const activeProductId = selectedVariants[groupData.id || groupData.name] || productsInGroup[0].id;
    const activeProduct = productsInGroup.find((p: any) => p.id === activeProductId) || productsInGroup[0];

    return (
      <motion.div 
        key={groupData.id || groupData.name}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="md:w-2/5 relative h-72 md:h-auto overflow-hidden bg-slate-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                {activeProduct.image ? (
                  <img 
                    src={activeProduct.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt={activeProduct.name} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={48} className="text-slate-200" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                {activeProduct.category || 'Dulce'}
              </span>
              {activeProduct.isFeatured && (
                <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> TOP VENTAS
                </span>
              )}
              {activeProduct.discountPrice && (
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  OFERTA
                </span>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
            <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter">
              {isGroup ? groupData.name : activeProduct.name}
            </h3>
            
            {(activeProduct.description || groupData.description) && (
              <p className="text-slate-500 font-serif italic text-lg mb-6 leading-relaxed">
                {activeProduct.description || groupData.description}
              </p>
            )}

            {/* Variant Selector */}
            {isGroup && productsInGroup.length > 1 && (
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Opciones disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {productsInGroup.map((p: any) => {
                    let label = p.name;
                    if (p.name.toLowerCase().startsWith(groupData.name.toLowerCase())) {
                      label = p.name.substring(groupData.name.length).trim().replace(/^\(|\)$/g, '');
                    }
                    if (!label) label = "Original";
                    
                    const isSelected = activeProduct.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedVariants({ ...selectedVariants, [groupData.id || groupData.name]: p.id })}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          isSelected ? 'bg-slate-800 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sale Formats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeProduct.saleFormats.map((format: any) => {
                const inCart = cart.find(i => i.productId === activeProduct.id && i.formatName === format.name);
                const isAvailable = format.availability === 'in_stock';
                const formatLocked = isAgendaClosed && !isAvailable;

                return (
                  <div key={format.name} className={`flex items-center justify-between p-4 rounded-2xl border ${formatLocked ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 hover:border-rose-200'} transition-all`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format.name}</span>
                        {isAvailable ? (
                          <span className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-0.5"><Zap size={8} fill="currentColor"/> HOY</span>
                        ) : (
                          <span className="text-[8px] font-black text-amber-500 uppercase flex items-center gap-0.5"><Clock size={8}/> {format.leadTime || '48h'}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {activeProduct.discountPrice ? (
                          <>
                            <p className="text-xl font-black text-emerald-500">{formatCurrency(activeProduct.discountPrice * (format.multiplier || 1))}</p>
                            <p className="text-xs font-bold text-slate-300 line-through">{formatCurrency(format.price)}</p>
                          </>
                        ) : (
                          <p className="text-xl font-black text-slate-800">{formatCurrency(format.price)}</p>
                        )}
                      </div>
                    </div>

                    {formatLocked ? (
                      <span className="text-[8px] font-black text-rose-300 uppercase">Agenda Cerrada</span>
                    ) : inCart ? (
                      <div className="flex items-center gap-3 bg-rose-500 p-1 rounded-xl shadow-lg">
                        <button onClick={() => updateQuantity(activeProduct.id, format.name, -1)} className="p-1.5 text-white hover:scale-125 transition-transform"><Minus size={12}/></button>
                        <span className="font-black text-white text-sm">{inCart.quantity}</span>
                        <button onClick={() => updateQuantity(activeProduct.id, format.name, 1)} className="p-1.5 text-white hover:scale-125 transition-transform"><Plus size={12}/></button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(activeProduct, format)} className="p-3 bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 transition-all active:scale-90">
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
    );
  };

  if (isOrderSent) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-8">
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter">¡Pedido Registrado!</h2>
        <p className="text-slate-500 font-serif italic text-xl max-w-sm mx-auto mb-12">Estamos preparando tu dulzura artesanal. En breve nos pondremos en contacto contigo.</p>
        <button onClick={() => setIsOrderSent(false)} className="bg-slate-800 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-slate-900 transition-all">Ver el Menú</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-rose-100 scroll-smooth">
      {/* Portada Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center p-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/catalog_hero.png" className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-slate-50" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-white"
        >
          <div className="flex justify-center mb-8">
             <div className="w-20 h-20 bg-rose-500/20 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl">
               <ShoppingBag size={40} className="text-white" />
             </div>
          </div>
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter drop-shadow-2xl">Dulce Contraste</h1>
          <p className="text-xl md:text-3xl font-serif italic mb-12 drop-shadow-lg text-rose-100">Dulzura artesanal en cada bocado</p>
          
          <div className="flex flex-col items-center gap-8">
            <motion.button 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Explorar Menú</span>
              <ArrowDown size={24} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-200">D</div>
            <span className="font-black text-slate-800 tracking-tighter text-xl hidden sm:block">Dulce Contraste</span>
          </div>

          <div className="flex items-center gap-4">
            {settings.agendaStatus === 'closed' && (
              <div className="hidden md:flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full border border-rose-100">
                <AlertCircle size={14} className="text-rose-500" />
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Agenda Cerrada</span>
              </div>
            )}
            <button onClick={() => setIsCartOpen(true)} className="relative group">
              <div className="bg-slate-800 text-white p-4 rounded-2xl shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95">
                <ShoppingBag size={20} />
              </div>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white shadow-lg animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        {groupedCategories.map((section, sIdx) => (
          <section key={section.title} className="mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-end gap-6 mb-12"
            >
              <div className={`w-2 h-24 rounded-full ${
                section.type === 'star' ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]' :
                section.type === 'featured' ? 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 
                'bg-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.5)]'
              }`} />
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-2 ${
                  section.type === 'star' ? 'text-amber-500' :
                  section.type === 'featured' ? 'text-emerald-500' : 
                  'text-rose-400'
                }`}>
                  {section.type === 'star' ? 'Sugerencias del Chef' :
                   section.type === 'featured' ? 'Tentaciones de Hoy' : 
                   'Nuestra Selección de'}
                </p>
                <h2 className="text-6xl font-black text-slate-800 tracking-tighter flex items-center gap-4">
                  {section.title}
                  {section.type === 'star' && <ChefHat size={32} className="text-amber-500" />}
                </h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-12">
              {section.items.map(renderProduct)}
            </div>
          </section>
        ))}

        {/* Customizer Section (Diseña tu Torta) */}
        {recipes.some(r => r.catalogCategory) && (
          <section id="customizer" className="mb-32">
            <div className="bg-slate-900 rounded-[60px] p-10 md:p-20 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 blur-[120px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="w-16 h-1 bg-rose-500 mb-8 rounded-full" />
                  <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none">Diseña tu Torta Soñada</h2>
                  <p className="text-slate-400 text-xl font-serif italic mb-12">Crea una combinación única eligiendo tu base, relleno y cubierta favorita. Hecha a tu medida.</p>
                  
                  <div className="flex gap-4">
                    {[
                      { icon: <ChefHat size={16} />, label: 'Base' },
                      { icon: <Plus size={16} />, label: 'Relleno' },
                      { icon: <Zap size={16} />, label: 'Cubierta' }
                    ].map((step, i) => (
                      <div key={i} className={`flex-1 pb-4 border-b-2 transition-all flex flex-col items-center gap-2 ${i === activeStep ? 'border-rose-500 text-rose-500' : 'border-slate-800 text-slate-600'}`}>
                        {step.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 min-h-[400px] flex flex-col">
                  <AnimatePresence mode="wait">
                    {activeStep === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 gap-3">
                        {recipes.filter(r => r.catalogCategory === 'Base').map(r => (
                          <button key={r.id} onClick={() => { setCustomCake({ ...customCake, base: r.name }); setActiveStep(1); }} className={`p-6 rounded-2xl border-2 text-left transition-all ${customCake.base === r.name ? 'border-rose-500 bg-rose-500/10' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}>
                            <p className="font-black text-white">{r.name}</p>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Bizcocho Artesanal</p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                    {activeStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 gap-3">
                        {recipes.filter(r => r.catalogCategory === 'Relleno').map(r => (
                          <button key={r.id} onClick={() => { setCustomCake({ ...customCake, filling: r.name }); setActiveStep(2); }} className={`p-6 rounded-2xl border-2 text-left transition-all ${customCake.filling === r.name ? 'border-rose-500 bg-rose-500/10' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}>
                            <p className="font-black text-white">{r.name}</p>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Relleno Cremoso</p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                    {activeStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 gap-3">
                        {recipes.filter(r => r.catalogCategory === 'Cubierta').map(r => (
                          <button key={r.id} onClick={() => { setCustomCake({ ...customCake, cover: r.name }); setActiveStep(3); }} className={`p-6 rounded-2xl border-2 text-left transition-all ${customCake.cover === r.name ? 'border-rose-500 bg-rose-500/10' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}>
                            <p className="font-black text-white">{r.name}</p>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Acabado Final</p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                    {activeStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col justify-center text-center">
                        <div className="bg-white/5 rounded-3xl p-8 mb-8 border border-white/10">
                          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">¡Tu Creación!</h3>
                          <div className="space-y-4 text-left max-w-xs mx-auto">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                              <span className="text-[10px] font-black text-rose-400 uppercase">Base</span>
                              <span className="font-bold text-white">{customCake.base}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                              <span className="text-[10px] font-black text-rose-400 uppercase">Relleno</span>
                              <span className="font-bold text-white">{customCake.filling}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                              <span className="text-[10px] font-black text-rose-400 uppercase">Cubierta</span>
                              <span className="font-bold text-white">{customCake.cover}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const dummyProduct: Product = {
                              id: 'custom-cake',
                              name: `Torta Personalizada: ${customCake.base}/${customCake.filling}/${customCake.cover}`,
                              recipeId: '',
                              type: 'single',
                              saleFormats: [{ name: 'Personalizada', multiplier: 1, price: 0 }],
                              margin: 30
                            };
                            addToCart(dummyProduct, dummyProduct.saleFormats[0]);
                            setActiveStep(0);
                            setIsCartOpen(true);
                          }}
                          className="w-full bg-rose-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-rose-600 transition-all"
                        >
                          Añadir al Carrito
                        </button>
                        <button onClick={() => setActiveStep(0)} className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                          Reiniciar Diseño
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Cart Sidebar (Drawer) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-60 shadow-2xl flex flex-col h-dvh"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Tu Pedido</h3>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{cart.reduce((sum, i) => sum + i.quantity, 0)} productos seleccionados</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 pb-40 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-300">
                    <ShoppingBag size={64} className="mb-4" />
                    <p className="font-bold text-lg">Tu carrito está vacío</p>
                    <p className="text-sm">¡Agrega algo delicioso!</p>
                  </div>
                ) : (
                  <>
                    {settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && (
                      <div className="bg-emerald-50 p-5 rounded-[24px] border border-emerald-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-emerald-700 font-black text-[9px] uppercase tracking-widest">
                            <Truck size={12} />
                            {isFreeDelivery ? '¡Envío Gratis Activado!' : 'Meta de Envío Gratis'}
                          </div>
                          {!isFreeDelivery && (
                            <span className="text-emerald-600 font-black text-[9px]">{formatCurrency(settings.freeDeliveryThreshold - subtotal)} más</span>
                          )}
                        </div>
                        <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100)}%` }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-5">
                      {cart.map((item, idx) => (
                        <div key={`${item.productId}-${item.formatName}`} className="flex gap-4 group">
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-0.5">{item.formatName}</p>
                            <p className="font-bold text-slate-800 leading-tight text-sm">{item.productName}</p>
                            <p className="text-xs font-bold text-slate-400 mt-0.5">{formatCurrency(item.price)} c/u</p>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-100 px-3 py-1 rounded-xl h-fit self-center">
                            <button onClick={() => updateQuantity(item.productId, item.formatName, -1)} className="text-slate-400 hover:text-rose-500"><Minus size={12} /></button>
                            <span className="font-black text-slate-800 min-w-[16px] text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.formatName, 1)} className="text-slate-400 hover:text-rose-500"><Plus size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-5">
                      <div className="space-y-4">

                        {/* Nombre */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">¿A quién entregamos?</label>
                          <input 
                            type="text" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Tu Nombre Completo"
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                          />
                        </div>

                        {/* Delivery Method Toggle */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">¿Cómo lo recibes?</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => { setDeliveryMethod('delivery'); }}
                              className={`flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${
                                deliveryMethod === 'delivery'
                                  ? 'border-rose-500 bg-rose-50 text-rose-600'
                                  : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                              }`}
                            >
                              <Truck size={18} />
                              🛵 Delivery
                            </button>
                            <button
                              onClick={() => { setDeliveryMethod('pickup'); setSelectedZone(null); }}
                              className={`flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${
                                deliveryMethod === 'pickup'
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                                  : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                              }`}
                            >
                              <Home size={18} />
                              🏪 Recojo
                            </button>
                          </div>
                        </div>

                        {/* Delivery Fields */}
                        {deliveryMethod === 'delivery' ? (
                          <>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
                                <Home size={10} /> Dirección de Entrega
                              </label>
                              <div className="space-y-2">
                                <input 
                                  type="text" 
                                  value={deliveryAddress}
                                  onChange={(e) => setDeliveryAddress(e.target.value)}
                                  placeholder="Calle, Número, Urb..."
                                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                                />
                                <button 
                                  onClick={getGPSLocation}
                                  disabled={isLocating}
                                  className={`w-full flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-3.5 rounded-2xl transition-all ${
                                    gpsLocation 
                                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20'
                                  }`}
                                >
                                  <MapPin size={14} />
                                  {isLocating ? 'Obteniendo GPS...' : gpsLocation ? '📍 Ubicación Fijada' : '📍 Fijar Ubicación GPS'}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Truck size={12} /> Selecciona tu Ruta de Dulzura
                              </label>
                              <div className="grid grid-cols-1 gap-2">
                                {zones.map((zone) => (
                                  <button
                                    key={zone.name}
                                    onClick={() => setSelectedZone(zone)}
                                    className={`flex flex-col p-3.5 rounded-2xl border-2 transition-all text-left ${
                                      selectedZone?.name === zone.name
                                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                                        : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between w-full mb-1">
                                      <span className="text-[10px] font-black uppercase tracking-widest">{zone.name}</span>
                                      <span className="text-xs font-black">{formatCurrency(zone.cost)}</span>
                                    </div>
                                    {zone.description && (
                                      <p className="text-[9px] font-medium leading-tight text-slate-400">
                                        {zone.description}
                                      </p>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Pickup Info */
                          <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl space-y-1">
                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">📍 Punto de Recojo</p>
                            <p className="text-sm font-bold text-emerald-800">Dulce Contraste - Urb. Angamos, Piura</p>
                            <p className="text-[10px] text-emerald-600 font-medium">Te avisaremos por WhatsApp cuando tu pedido esté listo. ¡Sin costo de envío!</p>
                          </div>
                        )}

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                              {deliveryMethod === 'pickup' ? '¿Qué día recoges?' : '¿Qué día?'}
                            </label>
                            <input 
                              type="date" 
                              value={deliveryDate}
                              onChange={(e) => setDeliveryDate(e.target.value)}
                              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                              {deliveryMethod === 'pickup' ? '¿A qué hora recoges?' : '¿A qué hora?'}
                            </label>
                            <input 
                              type="time" 
                              value={deliveryTime}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 md:p-8 bg-white border-t border-slate-100 space-y-4 sticky bottom-0 z-30 pb-[env(safe-area-inset-bottom,24px)] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <span>{deliveryMethod === 'pickup' ? 'Envío' : 'Delivery'}</span>
                      <span className="text-emerald-500">
                        {deliveryMethod === 'pickup' ? '🏪 RECOJO GRATIS' : isFreeDelivery ? 'GRATIS' : formatCurrency(deliveryCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-1">
                      <span className="text-slate-800 font-black uppercase tracking-[0.2em] text-[10px]">Total Final</span>
                      <span className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={sendOrder}
                    className="w-full bg-emerald-500 text-white py-4.5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 text-xs"
                  >
                    <MessageCircle size={18} />
                    Confirmar Pedido
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Persistent Floating Cart Button (when sidebar is closed) */}
      {!isCartOpen && cart.length > 0 && (
        <motion.button 
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-rose-500 text-white p-6 rounded-full shadow-2xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-95 flex items-center gap-4"
        >
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-100">Ver Carrito</span>
            <span className="text-lg font-black">{formatCurrency(cartTotal)}</span>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ShoppingBag size={20} />
          </div>
        </motion.button>
      )}

      {/* Footer */}
      <footer className="bg-white py-20 px-6 border-t border-slate-100 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-12 h-12 bg-rose-500 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl mb-8">D</div>
          <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter">Dulce Contraste</h3>
          <p className="text-slate-400 font-serif italic text-lg mb-12">Donde cada detalle cuenta y cada bocado enamora.</p>
          <div className="flex justify-center gap-6 text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-widest">Artesanal</span>
            <span className="text-[10px] font-black uppercase tracking-widest">•</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
            <span className="text-[10px] font-black uppercase tracking-widest">•</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Con Amor</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
