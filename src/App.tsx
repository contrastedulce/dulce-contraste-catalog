import React, { useState, useEffect, useRef, useMemo, useCallback, Component, useDeferredValue } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ChefHat, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  Search, 
  Plus, 
  Sparkles,
  Settings,
  Calculator,
  Wrench,
  Download,
  Trash2,
  Cake,
  CheckCircle2,
  FileText,
  Upload,
  Eye,
  EyeOff,
  Users,
  Copy,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// import { GoogleGenAI, Type } from "@google/genai"; // Removed to use server proxy
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from './lib/utils';
import { Badge } from './components/shared/Badge';
import { SearchableSelect } from './components/shared/SearchableSelect';
import { processGastroData, processPurchaseReceipt, processSalesReceipt } from './services/GastroService';
import { Supply, Order, Equipment, Recipe, Product, AppSettings, FinanceSummary, Quote, Purchase, PurchaseItem, SupplierMapping, Customer } from './types';

// New Modular Components
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { InventoryView } from './components/inventory/InventoryView';
import { RecipesView } from './components/recipes/RecipesView';
import { OrdersView } from './components/orders/OrdersView';
import { ProductsView } from './components/products/ProductsView';
import { FinancesView } from './components/finances/FinancesView';
import { EquipmentView } from './components/equipment/EquipmentView';
import { QuotesView } from './components/quotes/QuotesView';
import { PurchasesView } from './components/purchases/PurchasesView';
import { ToolkitView } from './components/toolkit/ToolkitView';
import { SettingsView } from './components/settings/SettingsView';
import { CustomersView } from './components/customers/CustomersView';
import { ShoppingListView } from './components/shopping/ShoppingListView';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_RECIPES } from './constants/initialData';
import { PublicCatalogView } from './components/public/PublicCatalogView';
import { VoiceRecipeModal } from './components/recipes/VoiceRecipeModal';
import { createSyncChannel } from './lib/windowSync';
import { RecipeForm } from './components/recipes/RecipeForm';
import { OrderForm } from './components/orders/OrderForm';
import { SupplyModal } from './components/inventory/SupplyModal';
import { GlassCard } from './components/shared/GlassCard';
import { Button } from './components/shared/Button';
import { Modal } from './components/shared/Modal';
import { Input } from './components/shared/Input';
import { Flame } from 'lucide-react';




// Mock Data for Initial UI
const MOCK_SALES_DATA = [
  { name: 'Lun', sales: 4000 },
  { name: 'Mar', sales: 3000 },
  { name: 'Mie', sales: 2000 },
  { name: 'Jue', sales: 2780 },
  { name: 'Vie', sales: 1890 },
  { name: 'Sab', sales: 2390 },
  { name: 'Dom', sales: 3490 },
];


// Helper to ensure numbers are valid
const safeNum = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'string') {
    const n = parseFloat(val.replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.props = props;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '20px',
          backgroundColor: '#f9fafb',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '24px', 
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', 
            maxWidth: '400px', 
            width: '100%', 
            textAlign: 'center',
            border: '1px solid #fee2e2'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: '#fef2f2', 
              color: '#ef4444', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px' 
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>¡Ups! Algo salió mal</h2>
            <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '14px', lineHeight: '1.5' }}>
              La aplicación ha detectado un error inesperado. No te preocupes, tus datos están a salvo.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ 
                width: '100%', 
                padding: '16px', 
                backgroundColor: '#F27D26', 
                color: 'white', 
                border: 'none',
                borderRadius: '12px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(242, 125, 38, 0.2)'
              }}
            >
              Reiniciar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isImporting, setIsImporting] = useState(false);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isStockAdjustMode, setIsStockAdjustMode] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'critical'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [importText, setImportText] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [supplyFormData, setSupplyFormData] = useState<Partial<Supply>>({
    name: '',
    unit: '',
    cost: 0,
    category: 'Secos',
    stock: 0,
    minStock: 0
  });

  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [equipmentFormData, setEquipmentFormData] = useState({
    name: '',
    purchasePrice: 0,
    usefulLifeYears: 5,
    maintenanceCostMonthly: 0,
    operatingHoursMonthly: 160
  });

  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [recipeSubTab, setRecipeSubTab] = useState<'complete' | 'sub'>('complete');
  const [recipeFormData, setRecipeFormData] = useState<Partial<Recipe>>({
    name: '',
    type: 'complete',
    ingredients: [],
    equipment: [],
    laborCost: 0,
    laborMinutes: { heavy: 0, light: 0 },
    serviceMinutes: { electricity: 0, water: 0, gas: 0, machinery: 0, utensils: 0 },
    extraCosts: { biosecurity: 0, packaging: 0 },
    yield: 1,
    yieldUnit: 'un'
  });

  const [isSubRecipeModalOpen, setIsSubRecipeModalOpen] = useState(false);
  const [editingSubRecipe, setEditingSubRecipe] = useState<Recipe | null>(null);
  const [subRecipeFormData, setSubRecipeFormData] = useState<Partial<Recipe>>({
    name: '',
    type: 'sub',
    ingredients: [],
    equipment: [],
    laborCost: 0,
    laborMinutes: { heavy: 0, light: 0 },
    serviceMinutes: { electricity: 0, water: 0, gas: 0, machinery: 0, utensils: 0 },
    extraCosts: { biosecurity: 0, packaging: 0 },
    yield: 1,
    yieldUnit: 'g'
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '',
    recipeId: '',
    type: 'single',
    saleFormats: [{ name: 'Unidad', multiplier: 1, price: 0 }],
    margin: 30,
    categoryGroup: '',
    isActive: true
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderFormData, setOrderFormData] = useState<Partial<Order>>({
    customerName: '',
    items: [],
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    total: 0
  });

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [quoteFormData, setQuoteFormData] = useState<Omit<Quote, 'id'>>({
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    items: [],
    total: 0,
    notes: ''
  });
  const [quoteItemForm, setQuoteItemForm] = useState({ productId: '', formatName: '', quantity: 1 });

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [mappings, setMappings] = useState<SupplierMapping[]>([]);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [aiCooldown, setAiCooldown] = useState(0);
  const [aiProvider, setAiProvider] = useState<'gemini' | 'deepseek'>('gemini');
  const [purchaseFormData, setPurchaseFormData] = useState<Partial<Purchase>>({
    supplierName: '',
    date: new Date().toISOString().split('T')[0],
    items: [],
    status: 'pending'
  });
  const [tokensUsed, setTokensUsed] = useState(0);
  const [isProcessingOrderReceipt, setIsProcessingOrderReceipt] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  const deferredSearch = useDeferredValue(globalSearch);

  const [unitConverter, setUnitConverter] = useState({
    value: 1,
    from: 'kg',
    to: 'g'
  });


  const [recipeScaler, setRecipeScaler] = useState({
    originalYield: 1,
    targetYield: 1,
    ingredients: [] as any[]
  });

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orderItemForm, setOrderItemForm] = useState({
    productId: '',
    formatName: '',
    quantity: 1
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('bakery-theme');
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (e) {
        console.error("Error parsing saved theme", e);
      }
    }
    return {
      primaryColor: '#F27D26',
      borderRadius: '1rem',
      cardPadding: '2rem',
      sidebarWidth: '16rem',
      currency: 'PEN'
    };
  });

  // Persistence Effects: Unified Server Sync
  useEffect(() => {
    const syncData = async () => {
      try {
        // 1. Try to load from Server
        const response = await fetch('/api/db');
        const serverData = await response.json();
        
        if (serverData.supplies?.length > 0) {
          console.log("Datos cargados desde el servidor. Limpiando caché local antigua...");
          localStorage.removeItem('bakery-supplies-v2');
          localStorage.removeItem('bakery-orders-v2');
          localStorage.removeItem('bakery-recipes-v2');
          localStorage.removeItem('bakery-products-v2');
          
          setSupplies(serverData.supplies || []);
          setOrders(serverData.orders || []);
          setEquipment(serverData.equipment || []);
          setRecipes(serverData.recipes || []);
          setProducts(serverData.products || []);
          setQuotes(serverData.quotes || []);
          setPurchases(serverData.purchases || []);
          setMappings(serverData.mappings || []);
          if (serverData.settings) setSettings(serverData.settings);
          setLoading(false);
          return;
        }

        // 2. If Server is empty, check LocalStorage (Migration Bridge)
        const savedSupplies = localStorage.getItem('bakery-supplies-v2');
        const savedOrders = localStorage.getItem('bakery-orders-v2');
        const savedEquipment = localStorage.getItem('bakery-equipment-v2');
        const savedRecipes = localStorage.getItem('bakery-recipes-v2');
        const savedProducts = localStorage.getItem('bakery-products-v2');
        const savedQuotes = localStorage.getItem('bakery-quotes-v2');
        const savedSettings = localStorage.getItem('bakery-settings-v2');

        if (savedSupplies) {
          console.log("Migrando datos de LocalStorage al Servidor...");
          const migrationData = {
            supplies: JSON.parse(savedSupplies),
            orders: JSON.parse(savedOrders || '[]'),
            equipment: JSON.parse(savedEquipment || '[]'),
            recipes: JSON.parse(savedRecipes || '[]'),
            products: JSON.parse(savedProducts || '[]'),
            quotes: JSON.parse(savedQuotes || '[]'),
            customers: JSON.parse(localStorage.getItem('bakery-customers-v2') || '[]'),
            mappings: JSON.parse(localStorage.getItem('bakery-mappings-v2') || '[]'),
            settings: savedSettings ? JSON.parse(savedSettings) : settings
          };

          // Upload to server to persist once and for all
          await fetch('/api/db/sync/full', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(migrationData)
          });

          setSupplies(migrationData.supplies);
          setOrders(migrationData.orders);
          setEquipment(migrationData.equipment);
          setRecipes(migrationData.recipes);
          setProducts(migrationData.products);
          setQuotes(migrationData.quotes);
          if (migrationData.customers) setCustomers(migrationData.customers);
          if (migrationData.mappings) setMappings(migrationData.mappings);
          if (migrationData.settings) setSettings(migrationData.settings);
        } else {
          // 3. Fallback to Initial Samples if everything is empty
          const sampleSupplies = [
            { id: '1', name: 'Harina 0000', unit: 'kg', cost: 850, category: 'Secos', stock: 5, minStock: 10 },
            { id: '2', name: 'Manteca', unit: 'kg', cost: 4500, category: 'Lácteos', stock: 12, minStock: 5 },
            { id: '3', name: 'Azúcar', unit: 'kg', cost: 900, category: 'Secos', stock: 2, minStock: 5 },
          ];
          setSupplies(sampleSupplies);
          // Initial sync for first launch
          await fetch('/api/db/sync/full', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ supplies: sampleSupplies })
          });
        }
      } catch (e) {
        console.error("Error in Data Sync:", e);
      } finally {
        setLoading(false);
      }
    };

    syncData();
  }, []);

  // Request browser notification permission (Admin only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view')?.toLowerCase();
    if ((view === 'admin' || !view) && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Play alert sound using Web Audio API (no external files needed)
  const playOrderAlert = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    } catch (e) {
      console.warn('Audio alert failed:', e);
    }
  };

  // Background polling for new orders (Admin view only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view')?.toLowerCase();

    if (view === 'admin' || !view) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('/api/db');
          if (response.ok) {
            const serverData = await response.json();
            if (serverData.orders && serverData.orders.length !== orders.length) {
              const newCount = serverData.orders.length - orders.length;
              setOrders(serverData.orders);

              // Only alert for new orders (not deletions)
              if (newCount > 0) {
                const latestOrder = serverData.orders[serverData.orders.length - 1];
                const isFromCatalog = latestOrder?.source === 'catalog';
                const msg = isFromCatalog
                  ? `🍰 ¡Nuevo pedido web de ${latestOrder.customerName}! Total: S/ ${latestOrder.total?.toFixed(2)}`
                  : `📋 ${newCount} nuevo(s) pedido(s) registrado(s)`;

                // 1. In-app notification bar
                setNotification({ message: msg, type: 'success' });

                // 2. Browser push notification
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('🍰 Dulce Contraste — Nuevo Pedido', {
                    body: isFromCatalog
                      ? `${latestOrder.customerName} realizó un pedido por S/ ${latestOrder.total?.toFixed(2)}`
                      : `Tienes ${newCount} pedido(s) nuevo(s)`,
                    icon: '/favicon.ico',
                    tag: 'new-order',
                    requireInteraction: true,
                  });
                }

                // 3. Sound alert
                playOrderAlert();
              }
            }
          }
        } catch (e) {
          console.warn('Error en polling de datos:', e);
        }
      }, 15000); // Each 15 seconds for faster response

      return () => clearInterval(interval);
    }
  }, [orders.length]);

  // State Synchronization Bridge (Shared across all windows/popouts)
  const syncChannelRef = useRef<any>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const onStateReceived = (data: any) => {
      isSyncingRef.current = true;
      try {
        if (data.supplies) setSupplies(data.supplies);
        if (data.orders) setOrders(data.orders);
        if (data.equipment) setEquipment(data.equipment);
        if (data.recipes) setRecipes(data.recipes);
        if (data.products) setProducts(data.products);
        if (data.quotes) setQuotes(data.quotes);
        if (data.customers) setCustomers(data.customers);
        if (data.mappings) setMappings(data.mappings);
        if (data.settings) setSettings(data.settings);
        
        // Update editor states
        if (data.recipeFormData) setRecipeFormData(data.recipeFormData);
        if (data.subRecipeFormData) setSubRecipeFormData(data.subRecipeFormData);
        if (data.orderFormData) setOrderFormData(data.orderFormData);
      } finally {
        // Essential: Allow some time for state setting to propagate before enabling broadcast
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 50);
      }
    };

    const channel = createSyncChannel(onStateReceived, () => {
      // Handle state request using the latest state from the ref
      if (syncChannelRef.current && latestStateRef.current) {
        syncChannelRef.current.broadcastState(latestStateRef.current);
      }
    });
    syncChannelRef.current = channel;

    // Detect if this is a popout window
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view) {
      // In popout mode, we immediately ask the main window for its current state
      channel.requestState();
    }

    return () => channel.close();
  }, []);

  // Reference to always have the latest aggregate state for syncing new windows
  const latestStateRef = useRef<any>(null);

  // Broadcast any state change to other windows (debounced to avoid UI jank)
  useEffect(() => {
    if (loading || !syncChannelRef.current || isSyncingRef.current) return;
    
    const stateBundle = {
      supplies,
      orders,
      equipment,
      recipes,
      products,
      quotes,
      customers,
      mappings,
      settings,
      recipeFormData,
      subRecipeFormData
    };
    
    latestStateRef.current = stateBundle;

    const syncTimeout = setTimeout(() => {
      if (syncChannelRef.current) {
        syncChannelRef.current.broadcastState(stateBundle);
      }
    }, 500);

    return () => clearTimeout(syncTimeout);
  }, [supplies, orders, equipment, recipes, products, quotes, customers, mappings, settings, recipeFormData, subRecipeFormData, loading]);

  // Save changes to both Server and LocalStorage (backup)
  useEffect(() => {
    if (loading) return;

    const saveChanges = async () => {
      const fullData = { supplies, orders, equipment, recipes, products, quotes, purchases, customers, mappings, settings };
      
      // Update LocalStorage (Instant backup)
      localStorage.setItem('bakery-supplies-v2', JSON.stringify(supplies));
      localStorage.setItem('bakery-orders-v2', JSON.stringify(orders));
      localStorage.setItem('bakery-equipment-v2', JSON.stringify(equipment));
      localStorage.setItem('bakery-recipes-v2', JSON.stringify(recipes));
      localStorage.setItem('bakery-products-v2', JSON.stringify(products));
      localStorage.setItem('bakery-quotes-v2', JSON.stringify(quotes));
      localStorage.setItem('bakery-purchases-v2', JSON.stringify(purchases));
      localStorage.setItem('bakery-customers-v2', JSON.stringify(customers));
      localStorage.setItem('bakery-mappings-v2', JSON.stringify(mappings));
      localStorage.setItem('bakery-settings-v2', JSON.stringify(settings));

      // Sync to Server (Robust persistence)
      try {
        await fetch('/api/db/sync/full', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullData)
        });
      } catch (e) {
        console.error("Error saving to server:", e);
      }
    };

    const timeoutId = setTimeout(saveChanges, 2000); // Debounce to avoid spamming
    return () => clearTimeout(timeoutId);
  }, [supplies, orders, equipment, recipes, products, quotes, purchases, customers, mappings, settings, loading]);

  const handleExportData = () => {
    const data = {
      supplies,
      orders,
      equipment,
      recipes,
      products,
      quotes,
      purchases,
      customers,
      mappings,
      theme,
      version: '1.2.0',
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dulce-contraste-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Copia de seguridad descargada con éxito', 'success');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.supplies) setSupplies(data.supplies);
        if (data.orders) setOrders(data.orders);
        if (data.equipment) setEquipment(data.equipment);
        if (data.recipes) setRecipes(data.recipes);
        if (data.products) setProducts(data.products);
        if (data.quotes) setQuotes(data.quotes);
        if (data.purchases) setPurchases(data.purchases);
        if (data.customers) setCustomers(data.customers);
        if (data.mappings) setMappings(data.mappings);
        if (data.theme) setTheme(data.theme);
        showNotification('Datos importados con éxito', 'success');
      } catch (err) {
        console.error("Error importing data", err);
        showNotification('Error al importar el archivo', 'info');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('¿Estás seguro de que deseas borrar TODOS los datos? Esta acción no se puede deshacer.')) {
      setSupplies([]);
      setOrders([]);
      setEquipment([]);
      setRecipes([]);
      setProducts([]);
      setQuotes([]);
      setPurchases([]);
      setCustomers([]);
      setMappings([]);
      localStorage.clear();
      showNotification('Sistema restablecido por completo', 'success');
      window.location.reload();
    }
  };

  const formatPrice = useCallback((amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: theme.currency,
    }).format(amount);
  }, [theme.currency]);

  const formatCurrency = useCallback((amount: number, currency: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }, []);

  const calculateEquipmentHourlyCost = useCallback((e: Equipment) => {
    if (!e) return 0;
    const monthlyDepreciation = (e.purchasePrice || 0) / ((e.usefulLifeYears || 5) * 12);
    const fixedCostHourly = (monthlyDepreciation + (e.maintenanceCostMonthly || 0)) / (e.operatingHoursMonthly || 160);
    
    // Add energy cost if power and kwh price are available
    const energyCostHourly = ((e.powerWatts || 0) / 1000) * (settings.masterCosts.kwhPrice || 0);
    
    return fixedCostHourly + energyCostHourly;
  }, [settings.masterCosts.kwhPrice]);

  // Pre-calcular costos de recetas para evitar recursión innecesaria en el renderizado
  const calculateCost = useCallback((
    recipe: Recipe, 
    costs: Record<string, { total: number; fixed: number; variable: number }> = {}, 
    visiting = new Set<string>()
  ): { total: number; fixed: number; variable: number } => {
    if (!recipe) return { total: 0, fixed: 0, variable: 0 };
    if (costs[recipe.id] !== undefined) return costs[recipe.id];
    if (visiting.has(recipe.id)) return { total: 0, fixed: 0, variable: 0 }; // Evitar recursión infinita

    visiting.add(recipe.id);
    let variable = 0;
    let fixed = 0;
      
      // Legacy laborCost is treated as variable per yield
      variable += safeNum(recipe.laborCost);
      
      (recipe.ingredients || []).forEach(ing => {
        if (!ing) return;
        if (ing.supplyId) {
          const supply = supplies.find(s => s.id === ing.supplyId);
          if (supply) {
            const cost = safeNum(supply.cost) * safeNum(ing.quantity);
            if (ing.isFixed) {
              fixed += cost;
            } else {
              variable += cost;
            }
          }
        } else if (ing.recipeId) {
          const subRecipe = recipes.find(r => r.id === ing.recipeId);
          if (subRecipe) {
            const subRes = calculateCost(subRecipe, costs, visiting);
            const scale = safeNum(ing.quantity) / (safeNum(subRecipe.yield) || 1);
            if (ing.isFixed) {
              fixed += (subRes.variable + subRes.fixed) * scale;
            } else {
              variable += subRes.variable * scale;
              fixed += subRes.fixed * scale;
            }
          }
        }
      });

      (recipe.equipment || []).forEach(req => {
        if (!req) return;
        const eq = equipment.find(e => e.id === req.equipmentId);
        if (eq) {
          // Use specific watts if provided, else use equipment default
          const watts = req.wattsUsed || eq.powerWatts || 0;
          const kwhPrice = settings.masterCosts.kwhPrice || 0;
          
          const energyCost = (watts / 1000) * safeNum(req.hoursUsed) * kwhPrice;
          
          // Fixed cost part (depreciation + maintenance)
          const monthlyDepreciation = (eq.purchasePrice || 0) / ((eq.usefulLifeYears || 5) * 12);
          const fixedHourly = (monthlyDepreciation + (eq.maintenanceCostMonthly || 0)) / (eq.operatingHoursMonthly || 160);
          const fixedCost = fixedHourly * safeNum(req.hoursUsed);
          
          variable += energyCost + fixedCost;
        }
      });

      // New: Master Costing Logic (Labor & Services by Minutes)
      const mc = settings.masterCosts;
      if (mc && recipe.laborMinutes) {
        const heavyRate = (mc.salaries.heavy.monthly / mc.salaries.heavy.hoursPerMonth) / 60;
        const lightRate = (mc.salaries.light.monthly / mc.salaries.light.hoursPerMonth) / 60;
        variable += (safeNum(recipe.laborMinutes.heavy) * heavyRate);
        variable += (safeNum(recipe.laborMinutes.light) * lightRate);
      }

      if (mc && recipe.serviceMinutes) {
        const getServiceMinuteRate = (s: { monthly: number; usagePercent: number }) => 
          ((s.monthly * (s.usagePercent / 100)) / 240) / 60;

        variable += safeNum(recipe.serviceMinutes.electricity) * getServiceMinuteRate(mc.services.electricity);
        variable += safeNum(recipe.serviceMinutes.water) * getServiceMinuteRate(mc.services.water);
        variable += safeNum(recipe.serviceMinutes.gas) * getServiceMinuteRate(mc.services.gas);
        variable += safeNum(recipe.serviceMinutes.machinery) * getServiceMinuteRate(mc.services.machinery);
        if (recipe.serviceMinutes.utensils) {
          variable += safeNum(recipe.serviceMinutes.utensils) * getServiceMinuteRate(mc.services.utensils);
        }
      }

      if (recipe.extraCosts) {
        variable += safeNum(recipe.extraCosts.biosecurity);
        variable += safeNum(recipe.extraCosts.packaging);
      }

      visiting.delete(recipe.id);
    const res = { total: variable + fixed, fixed, variable };
    costs[recipe.id] = res;
    return res;
  }, [recipes, supplies, equipment, settings]);

  const recipeCosts = useMemo(() => {
    const costs: Record<string, { total: number; fixed: number; variable: number }> = {};
    const visiting = new Set<string>();

    recipes.forEach(r => calculateCost(r, costs, visiting));
    return costs;
  }, [recipes, calculateCost]);

  const getRecipeCost = useCallback((recipe: Recipe): number => {
    return recipe ? (recipeCosts[recipe.id]?.total || 0) : 0;
  }, [recipeCosts]);

  const getProductCost = useCallback((product: Product, formatName: string): { total: number; variable: number; fixed: number } => {
    if (!product) return { total: 0, variable: 0, fixed: 0 };
    const recipe = recipes.find(r => r.id === product.recipeId);
    if (!recipe) return { total: 0, variable: 0, fixed: 0 };
    
    const format = (product.saleFormats || []).find(f => f.name === formatName);
    if (!format) return { total: 0, variable: 0, fixed: 0 };

    let costInfo = recipeCosts[recipe.id] || { total: 0, fixed: 0, variable: 0 };
    
    // Si la receta se está editando ahora mismo, usamos los datos en vivo del formulario
    if (isRecipeModalOpen && editingRecipe?.id === recipe.id && recipeFormData) {
      costInfo = calculateCost(recipeFormData as Recipe);
    }

    const recipeYield = safeNum(recipe.yield) || 1;
    
    const baseVariablePerPortion = costInfo.variable / recipeYield;
    const baseFixedPerPortion = costInfo.fixed / recipeYield;
    
    let scale = 1;
    if (format.divisor && format.divisor > 0) {
      scale = 1 / format.divisor;
    } else {
      scale = format.multiplier || 0;
    }

    let variablePart = baseVariablePerPortion * scale;
    let fixedPart = baseFixedPerPortion * scale;
    
    // Add extra supplies for this format
    (format.extraSupplies || []).forEach(extra => {
      const supply = supplies.find(s => s.id === extra.supplyId);
      if (supply) {
        // Extra supplies (packaging) are also treated as fixed (no margin)
        fixedPart += (supply.cost || 0) * (extra.quantity || 0);
      }
    });

    return { 
      total: variablePart + fixedPart, 
      variable: variablePart, 
      fixed: fixedPart 
    };
  }, [recipes, supplies, recipeCosts]);

  // --- Automatizaciones Inteligentes ---

  const deductInventoryForOrder = useCallback((order: Order) => {
    setSupplies(prevSupplies => {
      const newSupplies = [...prevSupplies];
      let inventoryChanged = false;

      const processRecipeIngredients = (recipeId: string, multiplier: number) => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        (recipe.ingredients || []).forEach(ing => {
          if (ing.supplyId) {
            const supplyIdx = newSupplies.findIndex(s => s.id === ing.supplyId);
            if (supplyIdx > -1) {
              const deduction = ing.isFixed 
                ? safeNum(ing.quantity) // Fixed: ignore multiplier
                : (safeNum(ing.quantity) * multiplier); // Variable: scale
              
              newSupplies[supplyIdx] = {
                ...newSupplies[supplyIdx],
                stock: Math.max(0, newSupplies[supplyIdx].stock - deduction)
              };
              inventoryChanged = true;
            }
          } else if (ing.recipeId) {
            const subRecipe = recipes.find(r => r.id === ing.recipeId);
            if (subRecipe) {
              // Sub-recipes are treated as variable relative to parent batch, 
              // consistent with getProductCost logic
              const subMultiplier = (safeNum(ing.quantity) / (safeNum(subRecipe.yield) || 1)) * multiplier;
              processRecipeIngredients(subRecipe.id, subMultiplier);
            }
          }
        });
      };

      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product && product.recipeId) {
          const format = product.saleFormats.find(f => f.name === item.formatName);
          const formatMultiplier = format ? format.multiplier : 1;
          const totalMultiplier = (formatMultiplier * item.quantity);
          const recipe = recipes.find(r => r.id === product.recipeId);
          if (recipe) {
            const yieldAdjMultiplier = totalMultiplier / (safeNum(recipe.yield) || 1);
            processRecipeIngredients(product.recipeId, yieldAdjMultiplier);
          }
        }
      });

      return inventoryChanged ? newSupplies : prevSupplies;
    });
  }, [recipes, products]);

  const updateCustomerHistory = useCallback((order: Order) => {
    const customerName = order.customerName.trim();
    if (!customerName) return;

    setCustomers(prev => {
      const idx = prev.findIndex(c => c.name.toLowerCase() === customerName.toLowerCase());
      const today = new Date().toISOString().split('T')[0];
      const orderProductIds = order.items.map(i => i.productId);

      if (idx > -1) {
        const updated = [...prev];
        const current = updated[idx];
        const newFavorites = Array.from(new Set([...(current.favoriteProducts || []), ...orderProductIds])).slice(0, 5);

        updated[idx] = {
          ...current,
          totalSpent: safeNum(current.totalSpent) + safeNum(order.total),
          orderCount: safeNum(current.orderCount) + 1,
          lastOrderDate: today,
          favoriteProducts: newFavorites
        };
        return updated;
      } else {
        return [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          name: customerName,
          totalSpent: safeNum(order.total),
          orderCount: 1,
          lastOrderDate: today,
          favoriteProducts: orderProductIds.slice(0, 5)
        }];
      }
    });
  }, []);

  const financeSummary = useMemo((): FinanceSummary => {
    const deliveredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'delivered_credit' || o.status === 'delivered_paid');
    const totalIncome = orders.filter(o => o.status === 'delivered' || o.status === 'delivered_paid').reduce((sum, o) => sum + safeNum(o.total), 0);
    const totalCredit = orders.filter(o => o.status === 'delivered_credit').reduce((sum, o) => sum + safeNum(o.total), 0);
    
    let suppliesExpense = 0;
    let laborExpense = 0;
    let equipmentExpense = 0;

    deliveredOrders.forEach(order => {
      (order.items || []).forEach(item => {
        if (!item) return;
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const recipe = recipes.find(r => r.id === product.recipeId);
          if (recipe) {
            const format = (product.saleFormats || []).find(f => f.name === item.formatName);
            const multiplier = format ? safeNum(format.multiplier) : 1;
            const portionRatio = (multiplier * safeNum(item.quantity)) / (safeNum(recipe.yield) || 1);

            // Labor
            laborExpense += safeNum(recipe.laborCost) * portionRatio;

            // Supplies & Sub-recipes
            (recipe.ingredients || []).forEach(ing => {
              if (!ing) return;
              if (ing.supplyId) {
                const supply = supplies.find(s => s.id === ing.supplyId);
                if (supply) suppliesExpense += safeNum(supply.cost) * safeNum(ing.quantity) * portionRatio;
              } else if (ing.recipeId) {
                const subRecipe = recipes.find(r => r.id === ing.recipeId);
                if (subRecipe) {
                  const subCost = getRecipeCost(subRecipe);
                  suppliesExpense += (subCost / (safeNum(subRecipe.yield) || 1)) * safeNum(ing.quantity) * portionRatio;
                }
              }
            });

            // Equipment
            (recipe.equipment || []).forEach(req => {
              if (!req) return;
              const eq = equipment.find(e => e.id === req.equipmentId);
              if (eq) equipmentExpense += calculateEquipmentHourlyCost(eq) * safeNum(req.hoursUsed) * portionRatio;
            });
          }
        }
      });
    });

    const totalExpenses = suppliesExpense + laborExpense + equipmentExpense;
    
    // Add direct purchases to expenses (Cash Flow / Direct Expenditure)
    const totalPurchases = (purchases || [])
      .filter(p => !p.date || !isNaN(new Date(p.date).getTime())) // Only valid dates
      .reduce((sum, p) => sum + safeNum(p.total), 0);

    return {
      totalIncome,
      totalExpenses: totalExpenses + totalPurchases,
      suppliesExpense: suppliesExpense + totalPurchases,
      laborExpense,
      equipmentExpense,
      totalCredit,
      netProfit: totalIncome - (totalExpenses + totalPurchases)
    };
  }, [orders, recipes, products, supplies, equipment, recipeCosts, purchases]);

  useEffect(() => {
    localStorage.setItem('bakery-theme', JSON.stringify(theme));
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--border-radius', theme.borderRadius);
    document.documentElement.style.setProperty('--card-padding', theme.cardPadding);
    document.documentElement.style.setProperty('--sidebar-width', theme.sidebarWidth);
  }, [theme]);

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    showNotification('Ficha de cliente actualizada', 'success');
  };

  const showNotification = useCallback((message: string, type: 'success' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // AI Generation with retries is now handled server-side

  const handleAIImport = async () => {
    if (!importText.trim()) return;
    let allExtractedData: any[] = [];
    try {
      // Use local type-like definitions for schema since SDK is removed from client
      const Type = { ARRAY: 'ARRAY', OBJECT: 'OBJECT', STRING: 'STRING', NUMBER: 'NUMBER' };
      const currentYear = new Date().getFullYear();
      
      let prompt = "";
      let schema: any = {};
      let useTable = false;

      if (activeTab === 'inventory') {
        prompt = `Analiza el siguiente texto y extrae una lista de insumos de pastelería. 
        Para cada insumo, determina su nombre, cantidad (stock), unidad de medida y costo unitario.
        IMPORTANTE: Clasifica cada insumo en una de estas categorías: 'Secos', 'Lácteos', 'Frescos', 'Packaging'. 
        Si no estás seguro, usa 'Secos'.`;
        schema = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              stock: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              cost: { type: Type.NUMBER },
              category: { 
                type: Type.STRING,
                enum: ['Secos', 'Lácteos', 'Frescos', 'Packaging']
              }
            },
            required: ["name", "stock", "unit", "cost", "category"]
          }
        };
      } else if (activeTab === 'recipes') {
        prompt = `Analiza el siguiente texto y extrae las recetas de pastelería presentes.
        Identifica si hay sub-recetas (ej: rellenos, coberturas, cremas, masas base) y la receta principal (la completa).

        Para cada receta extrae:
        - nombre
        - tipo: 'sub' (si es un componente o base) o 'complete' (si es el producto final)
        - ingredientes (nombre y cantidad en la unidad base)
        - equipo necesario (nombre y horas de uso)
        - costo de mano de obra
        - rendimiento (porciones)

        IMPORTANTE: Si la receta principal usa una sub-receta como ingrediente, inclúyela en la lista de ingredientes de la receta principal con su nombre exacto.

        TABLA DE CONVERSIÓN DE MEDIDAS:
        - Aceite vegetal: 1 taza = 250 ml
        - Leche fresca / UHT: 1 taza = 250 ml
        - Crema de leche: 1 taza = 250 ml
        - Agua / Caldo / Café: 1 taza = 250 ml
        - Vino / Licores: 1 onza = 30 ml
        - Vinagre blanco: 1 cdta = 5 ml
        - Esencia de Vainilla: 1 cdta = 5 ml
        - Harina (sin preparar/todo uso): 1 taza = 125 g
        - Azúcar blanca: 1 taza = 200 g
        - Azúcar rubia: 1 taza = 220 g
        - Cocoa / Cacao: 1 taza = 100 g
        - Azúcar en polvo: 1 taza = 120 g
        - Maicena: 1 cda = 8 g
        - Polvo de hornear: 1 cdta = 5 g
        - Bicarbonato: 1 cdta = 5 g
        - Sal: 1 cdta = 5 g
        - Canela molida: 1 cda = 8 g
        - Leche Condensada: 1 lata = 393 g
        - Leche Evaporada Gloria: 1 lata = 390 g
        - Mantequilla: 1 cda = 15 g
        - Ajo molido / Ají amarillo: 1 cda = 15 g
        - Queso rallado: 1 taza = 100 g
        - Pecanas picadas: 1 taza = 100 g

        Si un ingrediente no está en la tabla, intenta usar una conversión estándar o mantén la unidad si es clara.`;
        schema = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['sub', 'complete'] },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.NUMBER }
                  },
                  required: ["name", "quantity"]
                }
              },
              equipment: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hoursUsed: { type: Type.NUMBER }
                  },
                  required: ["name", "hoursUsed"]
                }
              },
              laborCost: { type: Type.NUMBER },
              yield: { type: Type.NUMBER },
              yieldUnit: { type: Type.STRING }
            },
            required: ["name", "type", "ingredients", "yield"]
          }
        };
      } else if (activeTab === 'orders') {
        const catalogList = products.map(p => `- ${p.name}`).join('\n');
        prompt = `Analiza el siguiente extracto de chat o texto y extrae una lista de pedidos de clientes.
        
        CATÁLOGO DE PRODUCTOS DISPONIBLES:
        ${catalogList}

        IMPORTANTE:
        1. Ignora conversaciones, enlaces o mensajes de sistema que no sean pedidos.
        2. Identifica el nombre del cliente (ej: "Clarita", "Cynthia", "Karencita", "Josy", "Leyla Corales", "Mao"). 
        CRÍTICO: Crea un objeto de pedido INDEPENDIENTE para CADA cliente. NUNCA agrupes varios nombres de clientes en un solo pedido (ej. NO uses "Clara, Cynthia"). Si el texto menciona múltiples personas pidiendo algo, debes crear un pedido separado en el arreglo para cada persona.
        3. Extrae la lista de productos y cantidades para cada persona individualmente. Usa TU INTELIGENCIA para deducir qué producto del CATÁLOGO DE PRODUCTOS se refiere el cliente y ESCRIBE EL NOMBRE EXACTO DEL CATÁLOGO.
        4. Determina la FECHA DE ENTREGA del pedido. ATENCIÓN AL AÑO: Los textos de WhatsApp suelen tener un prefijo con la fecha del mensaje (ej: "[11/12/2025]"). Si ves esto, la fecha de entrega (ej: "Lunes 15/12") debe heredar ESE mismo año (ej: "2025-12-15"). SOLO si no hay ninguna pista del año en todo el texto, asume que el año es ${currentYear}.
        5. Asume un total de 0 si no hay precios.
        6. El estado debe ser 'delivered' si la fecha es pasada, o 'pending' si es actual/futura.`;
        schema = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              customerName: { type: Type.STRING },
              total: { type: Type.NUMBER },
              date: { type: Type.STRING },
              status: { 
                type: Type.STRING,
                enum: ['pending', 'preparing', 'delivered']
              },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.NUMBER }
                  },
                  required: ["name", "quantity"]
                }
              }
            },
            required: ["customerName", "total", "status"]
          }
        };
      }

      // Chunking logic to handle large amounts of data
      const lines = importText.split('\n');
      const chunks: string[] = [];
      let currentChunk = "";
      const MAX_CHUNK_SIZE = 40000; // Increased to handle massive files (200k chars) in fewer calls

      for (const line of lines) {
        if ((currentChunk.length + line.length) > MAX_CHUNK_SIZE && currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = "";
        }
        currentChunk += line + "\n";
      }
      if (currentChunk.trim()) chunks.push(currentChunk);

      setTokensUsed(0);
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        setImportProgress(Math.round((i / chunks.length) * 100));

        try {
          // Unified AI request via server proxy
          const response = await fetch('/api/ai/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              provider: aiProvider, 
              prompt, 
              chunk, 
              schema,
              useTable: activeTab === 'recipes' 
            })
          });
          
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Error procesando IA');
          }
          
          const data = await response.json();
          if (data.usage?.totalTokens) {
            setTokensUsed(prev => prev + data.usage.totalTokens);
          }
          let responseText = data.text || "";

          // Cleanup for non-json responses or markdown fences
          responseText = responseText.replace(/```json\n?|\n?```/g, "").trim();

          if (!responseText) {
            console.warn(`Parte ${i + 1} no devolvió texto.`);
            continue;
          }

          try {
            const extractedData = JSON.parse(responseText);
            const finalData = (extractedData.items || extractedData.recipes || extractedData.orders || extractedData);
            if (Array.isArray(finalData)) {
              allExtractedData = [...allExtractedData, ...finalData.filter(Boolean)];
            } else if (finalData) {
              allExtractedData.push(finalData);
            }
          } catch (parseError) {
            console.error(`Error parseando JSON de parte ${i + 1}:`, parseError, responseText);
            showNotification(`La parte ${i + 1} de la IA llegó con formato inválido. Reintentando o ignorando...`, 'info');
          }
        } catch (error) {
            const is429 = String(error).includes('429') || String(error).includes('quota');
            
            if (is429 && aiProvider === 'gemini') {
              console.warn("Gemini quota exhausted, checking DeepSeek fallback...");
              // Ideally the server should tell us if DeepSeek is active, but we can check here too
              // or just try and handle the error if it fails.
              setAiProvider('deepseek');
              showNotification('Google (Gemini) se agotó por hoy. Intentando con DeepSeek...', 'info');
              throw new Error('CAMBIO_AUTO_PROVIDER');
            }
            
            console.error(`Error procesando parte ${i + 1}:`, error);
            const friendlyError = String(error).includes('Todas las llaves') 
              ? error 
              : `Error en parte ${i + 1}: ${error}`;
            showNotification(String(friendlyError), 'info');
        }
      }

      setImportProgress(100);
      const extractedData = allExtractedData;
      
      if (activeTab === 'inventory') {
        if (Array.isArray(extractedData) && extractedData.length > 0) {
          const newSupplies: Supply[] = extractedData.filter(Boolean).map(item => ({
            id: Math.random().toString(36).substr(2, 9),
            name: String(item?.name || 'Insumo sin nombre'),
            unit: String(item?.unit || 'un'),
            cost: safeNum(item?.cost),
            category: (['Secos', 'Lácteos', 'Frescos', 'Packaging'].includes(item?.category) ? item?.category : 'Secos') as Supply['category'],
            stock: safeNum(item?.stock),
            minStock: Math.ceil(safeNum(item?.stock) * 0.2)
          }));
          setSupplies(prev => [...prev, ...newSupplies]);
          showNotification(`Se importaron ${newSupplies.length} insumos`, 'success');
        }
      } else if (activeTab === 'recipes') {
        const extractedRecipes = (Array.isArray(extractedData) ? extractedData : [extractedData]).filter(Boolean);
        const newlyCreatedRecipes: Recipe[] = [];

        // First pass: Create all recipes (so we have IDs for sub-recipes)
        for (const rData of extractedRecipes) {
          if (!rData) continue;
          const newRecipe: Recipe = {
            id: Math.random().toString(36).substr(2, 9),
            name: String(rData.name || 'Nueva Receta IA'),
            type: (rData.type === 'sub' || rData.type === 'complete') ? rData.type : 'complete',
            ingredients: [], // Will fill in second pass
            equipment: (rData.equipment || []).filter(Boolean).map((eq: any) => {
              const eqName = String(eq?.name || '');
              const match = equipment.find(e => e?.name?.toLowerCase().includes(eqName.toLowerCase()));
              return {
                equipmentId: match ? match.id : 'unknown',
                hoursUsed: safeNum(eq?.hoursUsed)
              };
            }),
            laborCost: safeNum(rData.laborCost),
            yield: safeNum(rData.yield) || 1,
            yieldUnit: String(rData.yieldUnit || 'un')
          };
          newlyCreatedRecipes.push(newRecipe);
        }

        // Second pass: Fill ingredients and link sub-recipes
        for (let i = 0; i < newlyCreatedRecipes.length; i++) {
          const rData = extractedRecipes[i];
          if (!rData) continue;
          newlyCreatedRecipes[i].ingredients = (rData.ingredients || []).filter(Boolean).map((ing: any) => {
            const ingName = String(ing?.name || '');
            // Check if it's a sub-recipe (either existing or newly created)
            const subRecipeMatch = [...recipes, ...newlyCreatedRecipes].find(r => 
              r?.name?.toLowerCase() === ingName.toLowerCase() && r?.id !== newlyCreatedRecipes[i].id
            );
            
            if (subRecipeMatch) {
              return {
                recipeId: subRecipeMatch.id,
                quantity: safeNum(ing?.quantity)
              };
            }

            // Otherwise check if it's a supply
            const supplyMatch = supplies.find(s => s?.name?.toLowerCase().includes(ingName.toLowerCase()));
            return {
              supplyId: supplyMatch ? supplyMatch.id : 'unknown',
              quantity: safeNum(ing?.quantity)
            };
          });
        }

        setRecipes(prev => [...prev, ...newlyCreatedRecipes]);
        
        // Open the last one for review ONLY if we have recipes
        if (newlyCreatedRecipes.length > 0) {
          const lastRecipe = newlyCreatedRecipes[newlyCreatedRecipes.length - 1];
          setEditingRecipe(lastRecipe);
          setRecipeFormData(lastRecipe);
          setIsRecipeModalOpen(true);
          showNotification(`Se importaron ${newlyCreatedRecipes.length} recetas. Por favor, revísalas.`, 'success');
        } else {
          showNotification('No se pudieron extraer recetas válidas del texto.', 'info');
        }
      } else if (activeTab === 'orders') {
        if (Array.isArray(extractedData)) {
          const newOrders: Order[] = extractedData.filter(Boolean).map(order => {
            const mappedItems = (order?.items || []).filter(Boolean).map((item: any) => {
              const itemName = String(item?.name || 'Producto');
              // Try to find the closest matching product
              const matchedProduct = products.find(p => 
                itemName.toLowerCase().includes(p.name.toLowerCase()) || 
                p.name.toLowerCase().includes(itemName.toLowerCase())
              );
              
              if (matchedProduct && matchedProduct.saleFormats && matchedProduct.saleFormats.length > 0) {
                // If the item name also hints at a format, try to match it
                let matchedFormat = matchedProduct.saleFormats[0];
                for (const format of matchedProduct.saleFormats) {
                  if (itemName.toLowerCase().includes(format.name.toLowerCase())) {
                    matchedFormat = format;
                    break;
                  }
                }
                
                return {
                  productId: matchedProduct.id,
                  formatName: matchedFormat.name,
                  quantity: safeNum(item?.quantity) || 1,
                  price: matchedFormat.price
                };
              }
              
              // Fallback to manual if no match
              return {
                productId: 'manual',
                formatName: itemName,
                quantity: safeNum(item?.quantity) || 1,
                price: 0
              };
            });

            // Calculate inferred total if AI didn't provide one
            let orderTotal = safeNum(order?.total);
            if (orderTotal === 0) {
              orderTotal = mappedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            }

            return {
              id: Math.random().toString(36).substr(2, 9),
              customerName: String(order?.customerName || 'Cliente Desconocido'),
              items: mappedItems,
              status: (order?.status === 'pending' || order?.status === 'preparing' || order?.status === 'delivered') ? order?.status : 'pending',
              date: String(order?.date || new Date().toISOString()),
              total: orderTotal
            };
          });
          setOrders(prev => [...prev, ...newOrders]);
          showNotification(`${newOrders.length} pedidos importados del historial`, 'success');
        }
      }

    } catch (error: any) {
      console.error("Error en importación IA:", error);
      const is503 = error?.status === 'UNAVAILABLE' || (error?.message && error.message.includes('503'));
      showNotification(is503 ? 'El servidor de IA está saturado. Reintenta en unos segundos.' : 'Error al procesar con IA', 'info');
    } finally {
      // 1. Cerrar el modal PRIMERO para desmontar animaciones de AI sin conflicto
      setIsImportModalOpen(false);
      
      // 2. Esperar a que el modal desaparezca físicamente del DOM (800ms)
      // para evitar el NotFoundError al limpiar estados que afectan al DOM del modal
      setTimeout(() => {
        try {
          setIsImporting(false);
          setImportProgress(0);
          setImportText('');
          
          // 3. Si hay recetas nuevas y NO hubo error catastrófico, abrirlas para edición
          if (activeTab === 'recipes' && Array.isArray(allExtractedData) && allExtractedData.length > 0) {
            const extractedRecipes = allExtractedData.filter(Boolean);
            if (extractedRecipes.length > 0) {
              const lastRecipeData = extractedRecipes[extractedRecipes.length - 1];
              if (lastRecipeData && lastRecipeData.name) {
                const lastProcessedName = lastRecipeData.name;
                // Búsqueda segura con filtros para evitar crashes
                const safeRecipes = (recipes || []).filter(Boolean);
                const lastOne = safeRecipes.findLast(r => r && r.name === lastProcessedName) || safeRecipes[safeRecipes.length - 1];
                
                if (lastOne && lastOne.name) {
                  setEditingRecipe(lastOne);
                  setRecipeFormData({
                    ...lastOne,
                    ingredients: lastOne.ingredients || [],
                    equipment: lastOne.equipment || []
                  });
                  setIsRecipeModalOpen(true);
                }
              }
            }
          }
        } catch (innerError) {
          console.error("Error silencioso en limpieza de importación:", innerError);
        }
      }, 800);

      // 4. Iniciar cooldown global de seguridad (20s)
      setAiCooldown(20);
      const cooldownTimer = setInterval(() => {
        setAiCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleQuickCreateSupply = (name: string, idx: number) => {
    const newSupply: Supply = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      unit: 'un',
      cost: 0,
      category: 'Secos',
      stock: 0,
      minStock: 0
    };
    setSupplies(prev => [...prev, newSupply]);
    
    // Update the ingredient in the recipe form
    const newIngs = [...(recipeFormData.ingredients || [])];
    newIngs[idx] = { ...newIngs[idx], supplyId: newSupply.id, recipeId: undefined };
    setRecipeFormData({ ...recipeFormData, ingredients: newIngs });
    
    showNotification(`Insumo "${name}" creado rápidamente.`, 'success');
  };

  const handleSaveSupply = (supplyData: any) => {
    if (!supplyData.name || !supplyData.unit) {
      showNotification('Por favor completa los campos obligatorios', 'info');
      return;
    }

    if (editingSupply) {
      setSupplies(prev => prev.map(s => s.id === editingSupply.id ? { 
        ...s, 
        ...supplyData,
        cost: safeNum(supplyData.cost),
        stock: safeNum(supplyData.stock),
        minStock: safeNum(supplyData.minStock)
      } : s));
      showNotification('Insumo actualizado con éxito', 'success');
    } else {
      const newSupply: Supply = {
        id: Math.random().toString(36).substr(2, 9),
        ...supplyData,
        cost: safeNum(supplyData.cost),
        stock: safeNum(supplyData.stock),
        minStock: safeNum(supplyData.minStock)
      };
      setSupplies(prev => [...prev, newSupply]);
      showNotification('Insumo agregado con éxito', 'success');
    }
    setIsSupplyModalOpen(false);
    setEditingSupply(null);
  };

  const handleDeleteSupply = (id: string) => {
    setSupplies(prev => prev.filter(s => s.id !== id));
    showNotification('Insumo eliminado', 'info');
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(e => e.id !== id));
    showNotification('Equipo eliminado', 'info');
  };

  const openEditSupply = (supply: Supply) => {
    setEditingSupply(supply);
    setSupplyFormData({
      category: supply.category,
      stock: supply.stock,
      minStock: supply.minStock
    });
    setIsSupplyModalOpen(true);
  };

  const openAddSupply = () => {
    setEditingSupply(null);
    setSupplyFormData({ name: '', unit: '', cost: 0, category: 'Secos', stock: 0, minStock: 0 });
    setIsSupplyModalOpen(true);
  };


  const handleSaveEquipment = () => {
    if (!equipmentFormData.name) return;
    if (editingEquipment) {
      setEquipment(prev => prev.map(e => e.id === editingEquipment.id ? { ...e, ...equipmentFormData } : e));
      showNotification('Equipo actualizado', 'success');
    } else {
      setEquipment(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), ...equipmentFormData }]);
      showNotification('Equipo agregado', 'success');
    }
    setIsEquipmentModalOpen(false);
  };

  const calculateHourlyCost = (e: Equipment) => {
    const monthlyDepreciation = e.purchasePrice / (e.usefulLifeYears * 12);
    return (monthlyDepreciation + e.maintenanceCostMonthly) / e.operatingHoursMonthly;
  };

  const handleSaveRecipe = () => {
    if (!recipeFormData.name) return;
    const recipeData: Recipe = {
      id: editingRecipe?.id || Math.random().toString(36).substr(2, 9),
      name: String(recipeFormData.name!),
      type: recipeFormData.type || 'complete',
      ingredients: (recipeFormData.ingredients || []).map(ing => ({
        ...ing,
        quantity: safeNum(ing.quantity)
      })),
      equipment: (recipeFormData.equipment || []).map(eq => ({
        ...eq,
        hoursUsed: safeNum(eq.hoursUsed)
      })),
      laborCost: safeNum(recipeFormData.laborCost),
      laborMinutes: {
        heavy: safeNum(recipeFormData.laborMinutes?.heavy),
        light: safeNum(recipeFormData.laborMinutes?.light)
      },
      serviceMinutes: {
        electricity: safeNum(recipeFormData.serviceMinutes?.electricity),
        water: safeNum(recipeFormData.serviceMinutes?.water),
        gas: safeNum(recipeFormData.serviceMinutes?.gas),
        machinery: safeNum(recipeFormData.serviceMinutes?.machinery),
        utensils: safeNum(recipeFormData.serviceMinutes?.utensils)
      },
      extraCosts: {
        biosecurity: safeNum(recipeFormData.extraCosts?.biosecurity),
        packaging: safeNum(recipeFormData.extraCosts?.packaging)
      },
      yield: safeNum(recipeFormData.yield) || 1,
      yieldUnit: String(recipeFormData.yieldUnit || 'un')
    };

    if (editingRecipe) {
      setRecipes(prev => prev.map(r => r.id === editingRecipe.id ? recipeData : r));
      showNotification('Receta actualizada', 'success');
    } else {
      setRecipes(prev => [...prev, recipeData]);
      showNotification('Receta creada', 'success');
    }
    setIsRecipeModalOpen(false);
    setEditingRecipe(null);
    setRecipeFormData({ 
      name: '', 
      type: 'complete', 
      ingredients: [], 
      equipment: [], 
      laborCost: 0, 
      laborMinutes: { heavy: 0, light: 0 },
      serviceMinutes: { electricity: 0, water: 0, gas: 0, machinery: 0, utensils: 0 },
      extraCosts: { biosecurity: 0, packaging: 0 },
      yield: 1 
    });
  };

  const handleSaveSubRecipe = () => {
    if (!subRecipeFormData.name) return;
    const recipeData: Recipe = {
      id: editingSubRecipe?.id || Math.random().toString(36).substr(2, 9),
      name: String(subRecipeFormData.name!),
      type: subRecipeFormData.type || 'sub',
      ingredients: (subRecipeFormData.ingredients || []).map(ing => ({
        ...ing,
        quantity: safeNum(ing.quantity)
      })),
      equipment: (subRecipeFormData.equipment || []).map(eq => ({
        ...eq,
        hoursUsed: safeNum(eq.hoursUsed)
      })),
      laborCost: safeNum(subRecipeFormData.laborCost),
      laborMinutes: {
        heavy: safeNum(subRecipeFormData.laborMinutes?.heavy),
        light: safeNum(subRecipeFormData.laborMinutes?.light)
      },
      serviceMinutes: {
        electricity: safeNum(subRecipeFormData.serviceMinutes?.electricity),
        water: safeNum(subRecipeFormData.serviceMinutes?.water),
        gas: safeNum(subRecipeFormData.serviceMinutes?.gas),
        machinery: safeNum(subRecipeFormData.serviceMinutes?.machinery),
        utensils: safeNum(subRecipeFormData.serviceMinutes?.utensils)
      },
      extraCosts: {
        biosecurity: safeNum(subRecipeFormData.extraCosts?.biosecurity),
        packaging: safeNum(subRecipeFormData.extraCosts?.packaging)
      },
      yield: safeNum(subRecipeFormData.yield) || 1,
      yieldUnit: String(subRecipeFormData.yieldUnit || 'g')
    };

    if (editingSubRecipe) {
      setRecipes(prev => prev.map(r => r.id === editingSubRecipe.id ? recipeData : r));
      showNotification('Sub-receta actualizada', 'success');
    } else {
      setRecipes(prev => [...prev, recipeData]);
      showNotification('Sub-receta creada', 'success');
    }
    setIsSubRecipeModalOpen(false);
    setEditingSubRecipe(null);
    setSubRecipeFormData({ 
      name: '', 
      type: 'sub', 
      ingredients: [], 
      equipment: [], 
      laborCost: 0, 
      laborMinutes: { heavy: 0, light: 0 },
      serviceMinutes: { electricity: 0, water: 0, gas: 0, machinery: 0, utensils: 0 },
      extraCosts: { biosecurity: 0, packaging: 0 },
      yield: 1,
      yieldUnit: 'g'
    });
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    showNotification('Receta eliminada', 'info');
  };

  const handleDuplicateRecipe = (recipe: Recipe) => {
    const duplicatedRecipe: Recipe = {
      ...recipe,
      id: Math.random().toString(36).substr(2, 9),
      name: `${recipe.name} (Copia)`,
      ingredients: recipe.ingredients ? [...recipe.ingredients] : []
    };
    setRecipes(prev => [...prev, duplicatedRecipe]);
    showNotification(`Receta duplicada con éxito`, 'success');
  };

  const handleBulkDeleteRecipes = () => {
    setRecipes(prev => prev.filter(r => !selectedRecipes.includes(r.id)));
    showNotification(`${selectedRecipes.length} recetas eliminadas`, 'info');
    setSelectedRecipes([]);
  };

  const toggleRecipeSelection = (id: string) => {
    setSelectedRecipes(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSaveProduct = () => {
    if (!productFormData.name) return;
    const productData: Product = {
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      name: String(productFormData.name!),
      recipeId: productFormData.recipeId,
      type: productFormData.type || 'single',
      saleFormats: (productFormData.saleFormats || []).map(f => ({
        ...f,
        multiplier: safeNum(f.multiplier),
        price: safeNum(f.price),
        availability: f.availability || 'on_order',
        leadTime: f.leadTime,
        image: f.image
      })),
      margin: safeNum(productFormData.margin) || 30,
      image: productFormData.image,
      description: productFormData.description,
      category: productFormData.category,
      categoryGroup: productFormData.categoryGroup,
      isActive: productFormData.isActive ?? true,
      isFeatured: productFormData.isFeatured ?? false,
      discountPrice: productFormData.discountPrice
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
      showNotification('Presentación actualizada', 'success');
    } else {
      setProducts(prev => [...prev, productData]);
      showNotification('Presentación creada', 'success');
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductFormData({ 
      name: '', 
      recipeId: '', 
      type: 'single', 
      saleFormats: [{ name: 'Unidad', multiplier: 1, price: 0 }], 
      margin: 30, 
      categoryGroup: '', 
      isActive: true,
      isFeatured: false
    });
  };

  const handleToggleProductVisibility = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: p.isActive === false } : p));
    showNotification('Visibilidad de producto actualizada', 'success');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotification('Presentación eliminada', 'info');
  };

  const handleSaveOrder = () => {
    if (!orderFormData.customerName) return;
    
    if (editingOrder) {
      const isDeliveredState = (s?: string) => s === 'delivered' || s === 'delivered_credit' || s === 'delivered_paid';
      const isStatusDeliveredNow = isDeliveredState(orderFormData.status) && !isDeliveredState(editingOrder.status);
      
      const updatedOrder: Order = { 
        ...editingOrder, 
        ...orderFormData,
        customerName: String(orderFormData.customerName),
        total: safeNum(orderFormData.total),
        items: (orderFormData.items || []).map(item => ({
          ...item,
          quantity: safeNum(item.quantity),
          price: safeNum(item.price)
        }))
      };

      setOrders(prev => prev.map(o => o.id === editingOrder.id ? updatedOrder : o));
      
      if (isStatusDeliveredNow) {
        deductInventoryForOrder(updatedOrder);
        updateCustomerHistory(updatedOrder);
      }
      
      showNotification('Pedido actualizado', 'success');
    } else {
      const newOrder: Order = {
        id: (orders.length + 101).toString(),
        customerName: String(orderFormData.customerName),
        items: (orderFormData.items || []).map(item => ({
          ...item,
          quantity: safeNum(item.quantity),
          price: safeNum(item.price)
        })),
        status: orderFormData.status || 'pending',
        date: new Date().toISOString().split('T')[0],
        total: safeNum(orderFormData.total) || 0
      };

      setOrders(prev => [newOrder, ...prev]);

      const isDeliveredState = (s?: string) => s === 'delivered' || s === 'delivered_credit' || s === 'delivered_paid';
      if (isDeliveredState(newOrder.status)) {
        deductInventoryForOrder(newOrder);
        updateCustomerHistory(newOrder);
      }

      showNotification('Pedido creado con éxito', 'success');
    }
    setIsOrderModalOpen(false);
    setEditingOrder(null);
  };

  const handlePurchaseReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingReceipt(true);
    showNotification('Procesando boleta con IA...', 'info');

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64 = await base64Promise;
      const extracted = await processPurchaseReceipt(base64);
      
      if (!extracted || !extracted.items) {
        throw new Error("No se pudo extraer información válida de la boleta");
      }
      
      // Intentar mapear automáticamente basado en aprendizajes previos
      const itemsWithMapping = extracted.items.map((item: any) => {
        const mapping = mappings.find(m => 
          m.supplierName?.toLowerCase() === extracted.supplierName?.toLowerCase() && 
          m.rawName?.toLowerCase() === item.rawName?.toLowerCase()
        );
        return {
          ...item,
          inventoryItemId: mapping ? mapping.inventoryItemId : undefined
        };
      });

      // Validar fecha para evitar 'null' o strings vacíos
      let finalDate = extracted.date?.trim();
      if (!finalDate || finalDate === "null" || isNaN(new Date(finalDate).getTime())) {
        finalDate = new Date().toISOString().split('T')[0];
      }

      setPurchaseFormData({
        id: Math.random().toString(36).substr(2, 9),
        supplierName: extracted.supplierName || 'Proveedor Desconocido',
        date: finalDate,
        items: itemsWithMapping,
        subtotal: extracted.subtotal || extracted.items.reduce((sum: number, i: any) => sum + (i.price || 0), 0),
        discount: extracted.totalDiscount || 0,
        total: extracted.total || extracted.items.reduce((sum: number, i: any) => sum + (i.price || 0), 0),
        status: 'pending'
      });
      
      setIsPurchaseModalOpen(true);
      showNotification('Datos extraídos con éxito', 'success');
    } catch (error: any) {
      console.error("Error al procesar boleta:", error);
      const isQuotaError = error?.message?.includes('429') || error?.status === 429 || error?.code === 429 || error?.message?.includes('limit: 0');
      const isApiKeyError = error?.message?.includes('API_KEY_INVALID') || error?.status === 400;
      
      showNotification(
        isQuotaError
          ? 'Límite de cuota diaria agotado (429). Por favor, intenta de nuevo mañana o usa otra API Key.'
          : isApiKeyError 
            ? 'Error de Configuración: API Key inválida o no configurada' 
            : 'Error al analizar la imagen. Intenta de nuevo o verifica tu conexión.', 
        'info'
      );
    } finally {
      // Retardo mayor para evitar "NotFoundError" por colisiones de renderizado en fallos rápidos
      setTimeout(() => {
        setIsProcessingReceipt(false);
        // Iniciar cooldown de 20 segundos para proteger cuota gratuita (Universal)
        setAiCooldown(20);
        const timer = setInterval(() => {
          setAiCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 500);
    }
  };

  const handleSalesReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingOrderReceipt(true);
    showNotification('Analizando boleta de venta...', 'info');

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
      });
      reader.readAsDataURL(file);
      const base64 = await base64Promise;
      const extracted = await processSalesReceipt(base64);

      if (!extracted || !extracted.items) throw new Error("Datos inválidos");

      const orderItems = extracted.items.map((item: any) => {
        const product = products.find(p => p.name.toLowerCase().includes(item.rawName.toLowerCase()) || item.rawName.toLowerCase().includes(p.name.toLowerCase()));
        return {
          productId: product?.id || '',
          formatName: product?.saleFormats[0]?.name || 'Unidad',
          quantity: item.quantity || 1,
          price: item.price || 0
        };
      });

      setOrderFormData({
        customerName: extracted.customerName || 'Cliente Boleta',
        date: extracted.date || new Date().toISOString().split('T')[0],
        items: orderItems,
        total: extracted.total || orderItems.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0),
        status: 'pending'
      });

      setIsOrderModalOpen(true);
      showNotification('Venta extraída con éxito', 'success');
    } catch (error) {
      console.error("Error AI Sales:", error);
      showNotification('No se pudo procesar la boleta de venta', 'info');
    } finally {
      setIsProcessingOrderReceipt(false);
    }
  };

  const handleSavePurchase = () => {
    if (!purchaseFormData.supplierName) return;

    const newPurchase = {
      ...purchaseFormData,
      id: purchaseFormData.id || Math.random().toString(36).substr(2, 9),
      status: 'completed' as const
    } as Purchase;

    const newSupplies = [...supplies];
    const newMappings = [...mappings];
    const today = new Date();

    // Registrar solo items no excluidos para el stock y costeo
    newPurchase.items.forEach(item => {
      if (item.inventoryItemId && !item.isExcluded) {
        const supplyIdx = newSupplies.findIndex(s => s.id === item.inventoryItemId);
        if (supplyIdx > -1) {
          const supply = newSupplies[supplyIdx];
          
          // 1. Siempre actualizar stock
          supply.stock += item.quantity;
          
          // 2. Alerta de Rentabilidad (Detección de alza de precios > 10%)
          const newUnitCost = safeNum(item.price) / (safeNum(item.quantity) || 1);
          const oldUnitCost = safeNum(supply.cost);
          
          if (oldUnitCost > 0 && newUnitCost > oldUnitCost * 1.1) {
            const percentInc = ((newUnitCost / oldUnitCost - 1) * 100).toFixed(0);
            showNotification(`¡Alerta! ${supply.name} subió un ${percentInc}%. Revisa tus márgenes.`, 'info');
          }

          // 3. Actualización de precios Diferida (cada 15 días)
          const lastUpdate = supply.lastCostUpdate ? new Date(supply.lastCostUpdate) : null;
          const diffDays = lastUpdate ? Math.floor((today.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24)) : 999;

          if (diffDays >= 15) {
            supply.cost = newUnitCost;
            supply.lastCostUpdate = today.toISOString().split('T')[0];
          }
        }

        // 3. Aprendizaje de Mapeo (Upsert)
        const mappingIdx = newMappings.findIndex(m => 
          m.supplierName.toLowerCase() === newPurchase.supplierName.toLowerCase() && 
          m.rawName.toLowerCase() === item.rawName.toLowerCase()
        );

        if (mappingIdx > -1) {
          if (newMappings[mappingIdx].inventoryItemId !== item.inventoryItemId) {
            newMappings[mappingIdx].inventoryItemId = item.inventoryItemId;
          }
        } else {
          newMappings.push({
            id: Math.random().toString(36).substr(2, 9),
            supplierName: newPurchase.supplierName,
            rawName: item.rawName,
            inventoryItemId: item.inventoryItemId
          });
        }
      }
    });

    setSupplies(newSupplies);
    setMappings(newMappings);
    setPurchases(prev => [newPurchase, ...prev]);
    setIsPurchaseModalOpen(false);
    showNotification('Compra registrada. Stock actualizado y precios auditados.', 'success');
  };

  const handleBulkDeleteOrders = () => {
    setOrders(prev => prev.filter(o => !selectedOrders.includes(o.id)));
    showNotification(`${selectedOrders.length} pedidos eliminados`, 'info');
    setSelectedOrders([]);
  };

  const generateQuotePDF = (quote: Quote) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(settings.primaryColor || '#F27D26');
    doc.text(settings.businessName || 'Dulce Contraste', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Cotización de Productos Gastronómicos', 20, 30);
    
    // Quote Info
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Cliente: ${quote.customerName}`, 20, 45);
    doc.text(`Fecha: ${new Date(quote.date).toLocaleDateString()}`, 20, 52);
    doc.text(`Cotización #: ${quote.id}`, 140, 45);
    
    // Table
    const tableData = quote.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return [
        product?.name || 'Producto',
        item.formatName,
        item.quantity,
        formatPrice(item.price),
        formatPrice(item.price * item.quantity)
      ];
    });
    
    autoTable(doc, {
      startY: 65,
      head: [['Producto', 'Formato', 'Cant.', 'Precio Unit.', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: settings.primaryColor || '#F27D26' },
      foot: [['', '', '', 'TOTAL', formatPrice(quote.total)]],
      footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' }
    });
    
    // Notes
    if (quote.notes) {
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text('Notas:', 20, finalY);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(quote.notes, 20, finalY + 7, { maxWidth: 170 });
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Gracias por su preferencia. Esta cotización tiene una validez de 15 días.', 105, pageHeight - 10, { align: 'center' });
    
    doc.save(`Cotizacion_${quote.customerName.replace(/\s+/g, '_')}_${quote.id}.pdf`);
  };

  const handleSaveQuote = () => {
    if (editingQuote) {
      setQuotes(prev => prev.map(q => q.id === editingQuote.id ? { ...editingQuote, ...quoteFormData } : q));
      showNotification('Cotización actualizada', 'success');
    } else {
      const newQuote: Quote = {
        id: `Q${Math.floor(1000 + Math.random() * 9000)}`,
        ...quoteFormData
      };
      setQuotes(prev => [newQuote, ...prev]);
      showNotification('Cotización creada', 'success');
    }
    setIsQuoteModalOpen(false);
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    showNotification('Cotización eliminada', 'info');
  };

  const handleQuoteItemAdd = () => {
    if (!quoteItemForm.productId || !quoteItemForm.formatName) return;
    
    const product = products.find(p => p.id === quoteItemForm.productId);
    const format = product?.saleFormats.find(f => f.name === quoteItemForm.formatName);
    
    if (product && format) {
      const newItem = {
        productId: product.id,
        formatName: format.name,
        quantity: quoteItemForm.quantity,
        price: format.price
      };
      
      const newItems = [...(quoteFormData.items || []), newItem];
      const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      setQuoteFormData({
        ...quoteFormData,
        items: newItems,
        total: newTotal
      });
      
      setQuoteItemForm({ productId: '', formatName: '', quantity: 1 });
    }
  };

  const openEditOrder = (order: Order) => {
    setEditingOrder(order);
    setOrderFormData({
      customerName: order.customerName,
      total: order.total,
      status: order.status,
      items: order.items
    });
    setIsOrderModalOpen(true);
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const navItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'recipes', label: 'Recetas', icon: ChefHat },
    { id: 'purchases', label: 'Compras', icon: ShoppingCart },
    { id: 'products', label: 'Presentaciones', icon: Cake },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'equipment', label: 'Equipos', icon: Wrench },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'quotes', label: 'Cotizador', icon: FileText },
    { id: 'finances', label: 'Finanzas', icon: TrendingUp },
    { id: 'tools', label: 'Herramientas', icon: Calculator },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            supplies={supplies}
            orders={orders}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
            setActiveTab={setActiveTab}
            setInventoryFilter={setInventoryFilter}
            showNotification={showNotification}
            mockSalesData={MOCK_SALES_DATA}
            recipes={recipes}
            products={products}
          />
        );
      case 'inventory':
        return (
          <InventoryView 
            supplies={supplies}
            globalSearch={deferredSearch}
            setGlobalSearch={setGlobalSearch}
            inventoryFilter={inventoryFilter}
            setInventoryFilter={setInventoryFilter}
            isStockAdjustMode={isStockAdjustMode}
            setIsStockAdjustMode={setIsStockAdjustMode}
            aiCooldown={aiCooldown}
            onImportIA={() => setIsImportModalOpen(true)}
            onAddSupply={() => {
              setEditingSupply(null);
              setSupplyFormData({ name: '', unit: 'kg', cost: 0, category: 'Secos', stock: 0, minStock: 0 });
              setIsSupplyModalOpen(true);
            }}
            onEditSupply={(s: Supply) => {
              setEditingSupply(s);
              setSupplyFormData(s);
              setIsSupplyModalOpen(true);
            }}
            onDeleteSupply={handleDeleteSupply}
            handleStockChange={(id, delta) => {
              const newSupplies = [...supplies];
              const idx = newSupplies.findIndex(s => s.id === id);
              if (idx > -1) {
                newSupplies[idx].stock = Math.max(0, newSupplies[idx].stock + delta);
                setSupplies(newSupplies);
              }
            }}
            handleStockInput={(id, val) => {
              const newSupplies = [...supplies];
              const idx = newSupplies.findIndex(s => s.id === id);
              if (idx > -1) {
                newSupplies[idx].stock = val;
                setSupplies(newSupplies);
              }
            }}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
          />
        );
      case 'recipes':
        return (
          <RecipesView 
            recipes={recipes}
            supplies={supplies}
            globalSearch={deferredSearch}
            setGlobalSearch={setGlobalSearch}
            recipeSubTab={recipeSubTab}
            setRecipeSubTab={setRecipeSubTab}
            selectedRecipes={selectedRecipes}
            onToggleSelection={toggleRecipeSelection}
            onAddRecipe={() => {
              if (recipeSubTab === 'sub') {
                setEditingSubRecipe(null);
                setSubRecipeFormData({ 
                  name: '', 
                  type: 'sub', 
                  ingredients: [], 
                  equipment: [], 
                  laborCost: 0, 
                  laborMinutes: { heavy: 0, light: 0 },
                  serviceMinutes: { electricity: 0, water: 0, gas: 0, machinery: 0, utensils: 0 },
                  extraCosts: { biosecurity: 0, packaging: 0 },
                  yield: 1,
                  yieldUnit: 'g'
                });
                setIsSubRecipeModalOpen(true);
              } else {
                setEditingRecipe(null);
                setRecipeFormData({ 
                  name: '', 
                  type: 'complete', 
                  ingredients: [], 
                  equipment: [], 
                  laborCost: 0, 
                  laborMinutes: { heavy: 0, light: 0 },
                  serviceMinutes: { electricity: 0, water: 0, gas: 0, machinery: 0, utensils: 0 },
                  extraCosts: { biosecurity: 0, packaging: 0 },
                  yield: 1,
                  yieldUnit: 'un' 
                });
                setIsRecipeModalOpen(true);
              }
            }}
            onEditRecipe={(r: Recipe) => {
              if (r.type === 'sub') {
                setEditingSubRecipe(r);
                setSubRecipeFormData(r);
                setIsSubRecipeModalOpen(true);
              } else {
                setEditingRecipe(r);
                setRecipeFormData(r);
                setIsRecipeModalOpen(true);
              }
            }}
            onDeleteRecipe={handleDeleteRecipe}
            onDuplicateRecipe={handleDuplicateRecipe}
            onDeleteBulk={handleBulkDeleteRecipes}
            getRecipeCost={getRecipeCost}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
            settings={settings}
            onVoiceImport={() => setIsVoiceModalOpen(true)}
          />
        );
      case 'orders':
        return (
          <OrdersView 
            orders={orders}
            globalSearch={deferredSearch}
            setGlobalSearch={setGlobalSearch}
            selectedOrders={selectedOrders}
            onToggleSelection={toggleOrderSelection}
            onToggleAllSelection={(ids) => setSelectedOrders(ids)}
            onAddOrder={() => {
              setEditingOrder(null);
              setOrderFormData({ customerName: '', items: [], status: 'pending', date: new Date().toISOString().split('T')[0], total: 0 });
              setIsOrderModalOpen(true);
            }}
            onEditOrder={(o: Order) => {
              setEditingOrder(o);
              setOrderFormData(o);
              setIsOrderModalOpen(true);
            }}
            onDeleteOrder={(id) => {
              setOrders(prev => prev.filter(o => o.id !== id));
              showNotification('Pedido eliminado', 'info');
            }}
            onDeleteBulk={handleBulkDeleteOrders}
            onImportIA={() => setIsImportModalOpen(true)}
            onUploadReceipt={handleSalesReceiptUpload}
            isProcessingReceipt={isProcessingOrderReceipt}
            aiCooldown={aiCooldown}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
            onGenerateSunat={handleGenerateSunatFiles}
          />
        );
      case 'products':
        return (
          <ProductsView 
            products={products}
            recipes={recipes}
            globalSearch={deferredSearch}
            setGlobalSearch={setGlobalSearch}
            onAddProduct={() => {
              setEditingProduct(null);
              setProductFormData({ 
                name: '', 
                recipeId: '', 
                type: 'single', 
                saleFormats: [{ name: 'Unidad', multiplier: 1, price: 0 }], 
                margin: 30, 
                categoryGroup: '',
                isActive: true
              });
              setIsProductModalOpen(true);
            }}
            onEditProduct={(p: Product) => {
              setEditingProduct(p);
              setProductFormData(p);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onToggleVisibility={handleToggleProductVisibility}
            getProductCost={getProductCost}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
          />
        );
      case 'finances':
        return (
          <FinancesView 
            summary={financeSummary}
            mockSalesData={MOCK_SALES_DATA}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
          />
        );
      case 'equipment':
        return (
          <EquipmentView 
            equipment={equipment}
            globalSearch={deferredSearch}
            onAddEquipment={() => {
              setEditingEquipment(null);
              setEquipmentFormData({ name: '', purchasePrice: 0, usefulLifeYears: 5, maintenanceCostMonthly: 0, operatingHoursMonthly: 160 });
              setIsEquipmentModalOpen(true);
            }}
            onEditEquipment={(e: Equipment) => {
              setEditingEquipment(e);
              setEquipmentFormData(e);
              setIsEquipmentModalOpen(true);
            }}
            onDeleteEquipment={handleDeleteEquipment}
            calculateHourlyCost={calculateEquipmentHourlyCost}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
          />
        );
      case 'quotes':
        return (
          <QuotesView 
            quotes={quotes}
            products={products}
            globalSearch={deferredSearch}
            onAddQuote={() => {
              setEditingQuote(null);
              setQuoteFormData({ customerName: '', items: [], date: new Date().toISOString().split('T', 1)[0], total: 0, notes: '' });
              setIsQuoteModalOpen(true);
            }}
            onEditQuote={(q: Quote) => {
              setEditingQuote(q);
              setQuoteFormData(q);
              setIsQuoteModalOpen(true);
            }}
            onDeleteQuote={handleDeleteQuote}
            onDownloadPDF={generateQuotePDF}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
          />
        );
      case 'purchases':
        return (
          <PurchasesView 
            purchases={purchases}
            globalSearch={globalSearch}
            isProcessingReceipt={isProcessingReceipt}
            aiCooldown={aiCooldown}
            onUploadReceipt={handlePurchaseReceiptUpload}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
          />
        );
      case 'tools':
        return (
          <ToolkitView 
            recipes={recipes}
            supplies={supplies}
            recipeScaler={recipeScaler}
            setRecipeScaler={setRecipeScaler}
            unitConverter={unitConverter}
            setUnitConverter={setUnitConverter}
            safeNum={safeNum}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            settings={settings}
            onUpdateSettings={setSettings}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetData={handleResetData}
          />
        );
      case 'shopping-list':
        return (
          <ShoppingListView 
            orders={orders}
            products={products}
            recipes={recipes}
            supplies={supplies}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
          />
        );
      case 'customers':
        return (
          <CustomersView 
            customers={customers}
            products={products}
            orders={orders}
            globalSearch={deferredSearch}
            formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
            onUpdateCustomer={handleUpdateCustomer}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
              <Plus size={40} className="rotate-45" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Sección en Desarrollo</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-xs">
              Estamos modernizando esta pestaña para brindarte una mejor experiencia Premium.
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-bold animate-pulse text-lg tracking-tight">Preparando tu Cocina Premium...</p>
        </div>
      </div>
    );
  }

  // Routing Logic: Default to Catalog for Public, ?view=admin for Dashboard
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view')?.toLowerCase();
  
  // If no view is specified, or view is 'catalog', show the public catalog
  if (!view || view === 'catalog') {
    // If we are on localhost and no view is specified, default to admin for the owner
    if (!view && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
       // Continue to admin view logic below
    } else {
      return (
        <PublicCatalogView 
          products={products}
          settings={settings}
          recipes={recipes}
          formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
        />
      );
    }
  }

  const handleVoiceRecipeImport = async (text: string) => {
    if (!text.trim()) return;
    setIsImporting(true);
    setImportProgress(10);
    
    try {
      const prompt = `Extrae la receta de este texto dictado. 
      Responde ÚNICAMENTE en JSON con este formato: 
      { 
        "name": "Nombre", 
        "yield": 1, 
        "yieldUnit": "unidad", 
        "ingredients": [{ "name": "Ingrediente", "quantity": 100, "unit": "g" }] 
      }`;

      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'gemini',
          prompt,
          chunk: text,
          useTable: false
        })
      });

      if (!response.ok) throw new Error("Error en la IA");
      const data = await response.json();
      
      // Clean AI response from markdown blocks if present
      const cleanJson = data.text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Map to local supply IDs
      const mappedIngredients = (parsed.ingredients || []).map((ing: any) => {
        const supply = supplies.find(s => 
          s.name.toLowerCase().includes(ing.name.toLowerCase()) || 
          ing.name.toLowerCase().includes(s.name.toLowerCase())
        );
        return {
          id: Math.random().toString(36).substr(2, 9),
          supplyId: supply ? supply.id : '',
          quantity: ing.quantity || 0,
          isFixed: false
        };
      });

      setRecipeFormData({
        name: parsed.name || 'Nueva Receta Dictada',
        yield: parsed.yield || 1,
        yieldUnit: parsed.yieldUnit || 'Unidad',
        laborCost: 0,
        ingredients: mappedIngredients,
        equipment: [],
        type: 'complete',
        laborMinutes: { heavy: 0, light: 0 },
        serviceMinutes: { electricity: 0, water: 0, gas: 0, machinery: 0, utensils: 0 },
        extraCosts: { biosecurity: 0, packaging: 0 }
      });

      setIsVoiceModalOpen(false);
      setIsRecipeModalOpen(true);
      showNotification('Receta dictada procesada correctamente', 'success');

    } catch (e) {
      console.error("Error dictando receta:", e);
      showNotification('No pude entender bien la receta. Prueba de nuevo.', 'info');
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleGenerateSunatFiles = async (order: Order) => {
    try {
      const response = await fetch('/api/sunat/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, settings })
      });
      if (!response.ok) throw new Error("Error en el servidor");
      const data = await response.json();
      showNotification(`Archivos SFS generados para ${order.taxData?.documentType === 'factura' ? 'Factura' : 'Boleta'}`, 'success');
    } catch (e) {
      console.error(e);
      showNotification('Error al generar archivos para SUNAT', 'info');
    }
  };

  // If view is 'admin' or any other popout view, handle them here
  if (view && view !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 pt-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">Dulce Contraste Premium</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Sincronización Activa
              </p>
            </div>
          </div>
          
          {view === 'recipe-editor' && (
            <RecipeForm 
              recipeFormData={recipeFormData}
              setRecipeFormData={setRecipeFormData}
              supplies={supplies}
              recipes={recipes}
              equipment={equipment}
              onSave={handleSaveRecipe}
              onQuickCreateSupply={handleQuickCreateSupply}
            />
          )}

          {view === 'sub-recipe-editor' && (
            <RecipeForm 
              recipeFormData={subRecipeFormData}
              setRecipeFormData={setSubRecipeFormData}
              supplies={supplies}
              recipes={recipes}
              equipment={equipment}
              onSave={handleSaveSubRecipe}
              onQuickCreateSupply={handleQuickCreateSupply}
            />
          )}
          
          {view === 'order-editor' && (
            <OrderForm 
              orderFormData={orderFormData}
              setOrderFormData={setOrderFormData}
              products={products}
              onSave={handleSaveOrder}
              formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
            />
          )}

          {view === 'quote-editor' && (
             <div className="glass-morphism rounded-3xl p-8">
                <h1 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-wider">Editor de Cotizaciones</h1>
                <p className="text-sm text-slate-500 italic">Modo independiente en desarrollo para cotizaciones.</p>
             </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Show Admin Dashboard (only if ?view=admin is present)
  // This is the fallback for the final return below.

  return (
    <ErrorBoundary>
      <>
        <AppLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        onNewOrder={() => {
          setEditingOrder(null);
          setOrderFormData({ customerName: '', items: [], status: 'pending', date: new Date().toISOString().split('T')[0], total: 0 });
          setIsOrderModalOpen(true);
        }}
      >
        {renderActiveView()}
      </AppLayout>

      {/* Global Modals & Notifications */}

      {/* AI Import Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">Importar con IA (Modo Masivo)</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Procesado por fragmentos para máxima estabilidad</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1">
                    <button
                      onClick={() => setAiProvider('gemini')}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-xs font-black transition-all",
                        aiProvider === 'gemini' ? "bg-white shadow-xl text-emerald-600 scale-105" : "text-gray-400 hover:bg-gray-200/50"
                      )}
                    >
                      GEMINI
                    </button>
                    <button
                      onClick={() => setAiProvider('deepseek')}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-xs font-black transition-all",
                        aiProvider === 'deepseek' ? "bg-rose-500 text-white shadow-xl shadow-rose-200 scale-105" : "text-gray-400 hover:bg-gray-200/50"
                      )}
                    >
                      DEEPSEEK
                    </button>
                  </div>
                  
                  <label className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs hover:bg-emerald-100 transition-all cursor-pointer border-2 border-dashed border-emerald-200 shadow-sm group">
                    <Upload size={16} className="group-hover:animate-bounce" />
                    SUBIR ARCHIVO
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".txt,.md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setImportText(ev.target?.result as string);
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                  <button 
                    onClick={() => setIsImportModalOpen(false)}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-all hover:rotate-90"
                  >
                    <Plus className="rotate-45" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Contenido del Documento</label>
                    {importText && (
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 italic">
                          {importText.length.toLocaleString()} caracteres
                        </span>
                        <span className={cn(
                          "text-[10px] font-bold px-3 py-1 rounded-full border italic",
                          (importText.length / 4) > 800000 ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}>
                          Est. {(importText.length / 4).toLocaleString()} tokens 
                          { (importText.length / 4) > 1000000 && " (Excede cuota/min)"}
                        </span>
                      </div>
                    )}
                  </div>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    disabled={isImporting}
                    placeholder="Pega aquí tus recetas, inventario o pedidos..."
                    className={cn(
                      "w-full h-80 p-6 bg-gray-50 border border-gray-100 rounded-4xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-mono text-sm resize-none shadow-inner",
                      isImporting && "opacity-50 cursor-not-allowed"
                    )}
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsImportModalOpen(false)}
                    className="flex-1 py-5 rounded-3xl font-black text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAIImport}
                    disabled={isImporting}
                    className={cn(
                      "flex-1 py-5 rounded-3xl font-black text-white transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-xs",
                      isImporting ? "bg-gray-200 text-gray-400 cursor-not-allowed" : 
                      aiProvider === 'gemini' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" :
                      "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                    )}
                  >
                    {isImporting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Procesando ({importProgress}%)...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Procesar con {aiProvider.toUpperCase()}
                      </>
                    )}
                  </button>
                </div>
                
                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                      <span>Progreso: {importProgress}%</span>
                      <span>Tokens Consumidos: {tokensUsed.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${importProgress}%` }}
                        className={cn(
                          "h-full transition-all duration-300",
                          aiProvider === 'gemini' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supply Modal */}
      <SupplyModal 
        isOpen={isSupplyModalOpen}
        onClose={() => {
          setIsSupplyModalOpen(false);
          setEditingSupply(null);
        }}
        onSave={handleSaveSupply}
        initialData={supplyFormData}
        editingSupply={editingSupply}
      />

      {/* Equipment Modal */}
      <Modal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        title={editingEquipment ? 'Editar Equipo' : 'Nuevo Equipo'}
        description="Calcula la depreciación y costos operativos."
        maxWidth="max-w-xl"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre del Equipo</label>
            <input
              type="text"
              value={equipmentFormData.name}
              onChange={(e) => setEquipmentFormData({ ...equipmentFormData, name: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Precio Compra</label>
              <input
                type="number"
                value={equipmentFormData.purchasePrice}
                onChange={(e) => setEquipmentFormData({ ...equipmentFormData, purchasePrice: parseFloat(e.target.value) })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vida Útil (Años)</label>
              <input
                type="number"
                value={equipmentFormData.usefulLifeYears}
                onChange={(e) => setEquipmentFormData({ ...equipmentFormData, usefulLifeYears: parseFloat(e.target.value) })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mantenimiento (Mes)</label>
              <input
                type="number"
                value={equipmentFormData.maintenanceCostMonthly}
                onChange={(e) => setEquipmentFormData({ ...equipmentFormData, maintenanceCostMonthly: parseFloat(e.target.value) })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Uso Mensual (Horas)</label>
              <input
                type="number"
                value={equipmentFormData.operatingHoursMonthly}
                onChange={(e) => setEquipmentFormData({ ...equipmentFormData, operatingHoursMonthly: parseFloat(e.target.value) })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Potencia Promedio (Watts)</label>
            <div className="relative">
              <input
                type="number"
                value={equipmentFormData.powerWatts}
                onChange={(e) => setEquipmentFormData({ ...equipmentFormData, powerWatts: parseFloat(e.target.value) })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
                placeholder="Ej: 2000"
              />
            </div>
          </div>
          <button
            onClick={handleSaveEquipment}
            className="w-full py-4 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
          >
            Guardar Equipo
          </button>
        </div>
      </Modal>

      {/* Recipe Modal */}
      <Modal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        title={editingRecipe ? "Editar Receta Completa" : "Nueva Receta Completa"}
        description="Definir ingredientes, tiempos y costos de mano de obra."
        viewId="recipe-editor"
      >
        <RecipeForm 
          recipeFormData={recipeFormData}
          setRecipeFormData={setRecipeFormData}
          supplies={supplies}
          recipes={recipes}
          equipment={equipment}
          onSave={handleSaveRecipe}
          onQuickCreateSupply={handleQuickCreateSupply}
        />
      </Modal>

      {/* Sub-Recipe Modal */}
      <Modal
        isOpen={isSubRecipeModalOpen}
        onClose={() => setIsSubRecipeModalOpen(false)}
        title={editingSubRecipe ? "Editar Base o Relleno" : "Nueva Base o Relleno"}
        description="Definir ingredientes para sub-recetas."
        viewId="sub-recipe-editor"
      >
        <RecipeForm 
          recipeFormData={subRecipeFormData}
          setRecipeFormData={setSubRecipeFormData}
          supplies={supplies}
          recipes={recipes}
          equipment={equipment}
          onSave={handleSaveSubRecipe}
          onQuickCreateSupply={handleQuickCreateSupply}
        />
      </Modal>

      {/* Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Editar Presentación' : 'Nueva Presentación'}
        description="Configuración avanzada de formatos y costos extra (v2)"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre del Producto</label>
            <input
              type="text"
              value={productFormData.name}
              onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
              placeholder="Ej: Tarta de Frutos Rojos"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Link de Imagen (URL)</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={productFormData.image || ''}
                onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                placeholder="Pega el link de la foto aquí..."
                className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
              />
              {productFormData.image && (
                <div className="w-14 h-14 rounded-xl border border-gray-200 overflow-hidden bg-white shrink-0 shadow-sm">
                  <img 
                    src={productFormData.image} 
                    className="w-full h-full object-cover" 
                    alt="Preview" 
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Error')}
                  />
                </div>
              )}
            </div>
            <p className="text-[10px] font-bold text-gray-400 italic">Puedes usar links de Instagram, Pinterest o cualquier página web.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Descripción del Producto</label>
            <textarea
              value={productFormData.description || ''}
              onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
              placeholder="Ej: Esponjoso bizcocho con crema chantilly y piña fresca..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all resize-none h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Receta Base</label>
              <select
                value={productFormData.recipeId}
                onChange={(e) => setProductFormData({ ...productFormData, recipeId: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">Seleccionar receta...</option>
                {recipes.filter(r => r.type === 'complete').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categoría</label>
              <select
                value={productFormData.category || ''}
                onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">Sin categoría</option>
                <option value="Tortas">Tortas</option>
                <option value="Tartas">Tartas</option>
                <option value="Pasteles">Pasteles</option>
                <option value="Galletas">Galletas</option>
                <option value="Bocaditos Dulces y Salados">Bocaditos Dulces y Salados</option>
                <option value="Salados">Salados</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Precio de Oferta (Opcional)</label>
              <input
                type="number"
                value={productFormData.discountPrice || ''}
                onChange={(e) => setProductFormData({ ...productFormData, discountPrice: parseFloat(e.target.value) || undefined })}
                placeholder="Ej: 15.50"
                className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-emerald-700"
              />
              <p className="text-[10px] text-emerald-600 italic">Si lo llenas, aparecerá como oferta en el catálogo.</p>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors">
                <input
                  type="checkbox"
                  checked={productFormData.isFeatured || false}
                  onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-black text-amber-900 uppercase tracking-tighter leading-none">Destacado</p>
                  <p className="text-[8px] text-amber-700 font-bold uppercase tracking-widest mt-1">Sugerencia del Chef</p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-primary">Grupo de Producto (Catálogo)</label>
            <input
              type="text"
              value={productFormData.categoryGroup || ''}
              onChange={(e) => setProductFormData({ ...productFormData, categoryGroup: e.target.value })}
              placeholder="Ej: Torta de Chocolate"
              className="w-full p-4 bg-primary/5 border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary transition-all font-bold"
            />
            <p className="text-[10px] text-gray-400 italic">Si varios productos tienen el mismo nombre de grupo, se verán como uno solo en el catálogo web.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Margen Deseado (%)</label>
            <input
              type="number"
              value={productFormData.margin}
              onChange={(e) => setProductFormData({ ...productFormData, margin: parseFloat(e.target.value) })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Formatos de Venta</label>
              <button 
                onClick={() => setProductFormData({
                  ...productFormData,
                  saleFormats: [...(productFormData.saleFormats || []), { name: '', multiplier: 1, divisor: 1, price: 0, extraSupplies: [] }]
                })}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Agregar Formato
              </button>
            </div>
            <div className="space-y-3">
              {productFormData.saleFormats?.map((format, idx) => (
                <div key={idx} className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre (Ej: Docena)</label>
                      <input
                        type="text"
                        value={format.name}
                        onChange={(e) => {
                          const newFormats = [...(productFormData.saleFormats || [])];
                          newFormats[idx].name = e.target.value;
                          setProductFormData({ ...productFormData, saleFormats: newFormats });
                        }}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold"
                      />
                    </div>
                    <div className="w-20 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Mult. (x)</label>
                      <input
                        type="number"
                        value={format.multiplier}
                        onChange={(e) => {
                          const newFormats = [...(productFormData.saleFormats || [])];
                          newFormats[idx].multiplier = parseFloat(e.target.value) || 0;
                          newFormats[idx].divisor = 1 / (newFormats[idx].multiplier || 1);
                          setProductFormData({ ...productFormData, saleFormats: newFormats });
                        }}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm text-center"
                      />
                    </div>
                    <div className="w-20 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Div. (/)</label>
                      <input
                        type="number"
                        value={format.divisor || 1}
                        onChange={(e) => {
                          const newFormats = [...(productFormData.saleFormats || [])];
                          newFormats[idx].divisor = parseFloat(e.target.value) || 1;
                          newFormats[idx].multiplier = 1 / (newFormats[idx].divisor || 1);
                          setProductFormData({ ...productFormData, saleFormats: newFormats });
                        }}
                        className="w-full p-2 rounded-lg text-sm text-center bg-blue-50/30 border border-blue-100"
                      />
                    </div>
                    <div className="w-32 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Precio Venta</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={format.price}
                          onChange={(e) => {
                            const newFormats = [...(productFormData.saleFormats || [])];
                            newFormats[idx].price = parseFloat(e.target.value);
                            setProductFormData({ ...productFormData, saleFormats: newFormats });
                          }}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-black text-primary"
                        />
                        {productFormData.recipeId && (
                          <div className="absolute -top-7 right-0 flex justify-end w-full">
                            {(() => {
                              const formatCost = getProductCost(productFormData as Product, format.name);
                              const suggestedPrice = (formatCost.variable * (1 + (productFormData.margin || 0) / 100)) + formatCost.fixed;
                              return (
                                <button 
                                  onClick={() => {
                                    const newFormats = [...(productFormData.saleFormats || [])];
                                    newFormats[idx].price = Math.round(suggestedPrice);
                                    setProductFormData({ ...productFormData, saleFormats: newFormats });
                                  }}
                                  className="text-[9px] font-black text-primary hover:text-primary-600 transition-colors bg-white px-2 py-0.5 rounded-full border border-primary-100 shadow-sm"
                                  title={`Costo Total: ${formatCurrency(formatCost.total, theme.currency)} (Var: ${formatCurrency(formatCost.variable, theme.currency)}, Fijo: ${formatCurrency(formatCost.fixed, theme.currency)})`}
                                >
                                  Sug: <span className="text-primary-700">{formatCurrency(suggestedPrice, theme.currency)}</span>
                                </button>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newFormats = productFormData.saleFormats?.filter((_, i) => i !== idx);
                        setProductFormData({ ...productFormData, saleFormats: newFormats });
                      }}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors mb-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="bg-white/50 p-3 rounded-xl border border-gray-100/50">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                         <Package className="w-3 h-3" /> Insumos Extra (Cajas, bases, etc)
                       </span>
                       <button 
                         onClick={() => {
                            const newFormats = [...(productFormData.saleFormats || [])];
                            newFormats[idx].extraSupplies = [...(newFormats[idx].extraSupplies || []), { supplyId: '', quantity: 1 }];
                            setProductFormData({ ...productFormData, saleFormats: newFormats });
                         }}
                         className="text-[9px] font-bold text-primary hover:underline uppercase"
                       >
                         + Añadir Pago
                       </button>
                    </div>
                    <div className="space-y-2">
                      {(format.extraSupplies || []).map((extra, exIdx) => (
                        <div key={exIdx} className="flex gap-2 items-center">
                          <SearchableSelect 
                            className="flex-1"
                            options={supplies}
                            value={extra.supplyId}
                            onChange={(id) => {
                              const newFormats = [...(productFormData.saleFormats || [])];
                              newFormats[idx].extraSupplies![exIdx].supplyId = id;
                              setProductFormData({ ...productFormData, saleFormats: newFormats });
                            }}
                            placeholder="Elegir empaque..."
                          />
                          <input 
                            type="number"
                            value={extra.quantity}
                            onChange={(e) => {
                              const newFormats = [...(productFormData.saleFormats || [])];
                              newFormats[idx].extraSupplies![exIdx].quantity = parseFloat(e.target.value) || 0;
                              setProductFormData({ ...productFormData, saleFormats: newFormats });
                            }}
                            className="w-16 p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-center"
                            placeholder="Cant."
                          />
                          <button 
                            onClick={() => {
                              const newFormats = [...(productFormData.saleFormats || [])];
                              newFormats[idx].extraSupplies = newFormats[idx].extraSupplies?.filter((_, i) => i !== exIdx);
                              setProductFormData({ ...productFormData, saleFormats: newFormats });
                            }}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center bg-white/50 p-2 rounded-xl border border-gray-100/50 mt-2">
                    <ImageIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <input 
                      type="text"
                      placeholder="URL Imagen del formato (opcional)..."
                      value={format.image || ''}
                      onChange={(e) => {
                        const newFormats = [...(productFormData.saleFormats || [])];
                        newFormats[idx].image = e.target.value;
                        setProductFormData({ ...productFormData, saleFormats: newFormats });
                      }}
                      className="flex-1 bg-transparent border-none p-0 text-[10px] font-bold text-slate-600 focus:ring-0 placeholder:text-gray-300"
                    />
                    {format.image && (
                      <div className="w-6 h-6 rounded-md overflow-hidden border border-gray-200">
                        <img src={format.image} className="w-full h-full object-cover" alt="Thumb" />
                      </div>
                    )}
                  </div>

                  {/* Availability per Format */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                      <button
                        onClick={() => {
                          const newFormats = [...(productFormData.saleFormats || [])];
                          newFormats[idx].availability = 'in_stock';
                          newFormats[idx].leadTime = '';
                          setProductFormData({ ...productFormData, saleFormats: newFormats });
                        }}
                        className={`flex-1 py-1.5 rounded font-black text-[9px] uppercase transition-all ${format.availability === 'in_stock' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        En Stock
                      </button>
                      <button
                        onClick={() => {
                          const newFormats = [...(productFormData.saleFormats || [])];
                          newFormats[idx].availability = 'on_order';
                          setProductFormData({ ...productFormData, saleFormats: newFormats });
                        }}
                        className={`flex-1 py-1.5 rounded font-black text-[9px] uppercase transition-all ${format.availability !== 'in_stock' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        A Pedido
                      </button>
                    </div>
                    {format.availability !== 'in_stock' && (
                      <select
                        value={format.leadTime || ''}
                        onChange={(e) => {
                          const newFormats = [...(productFormData.saleFormats || [])];
                          newFormats[idx].leadTime = e.target.value;
                          setProductFormData({ ...productFormData, saleFormats: newFormats });
                        }}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-slate-600"
                      >
                        <option value="">Tiempo...</option>
                        <option value="24h">24h</option>
                        <option value="48h">48h</option>
                        <option value="72h">72h</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSaveProduct}
              className="w-full py-4 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
            >
              Guardar Presentación
            </button>
          </div>
        </div>
      </Modal>

      {/* Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title={editingOrder ? "Editar Pedido" : "Nuevo Pedido"}
        description="Gestiona los detalles del pedido y estado de entrega."
        viewId="order-editor"
      >
        <OrderForm 
          orderFormData={orderFormData}
          setOrderFormData={setOrderFormData}
          products={products}
          onSave={handleSaveOrder}
          formatCurrency={(amt) => formatCurrency(amt, theme.currency)}
        />
      </Modal>

      {/* Quote Modal */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => { setIsQuoteModalOpen(false); setEditingQuote(null); }}
        title={editingQuote ? "Editar Cotización" : "Nueva Cotización"}
        description="Genera documentos PDF profesionales para tus clientes."
        viewId="quote-editor"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre del Cliente</label>
                  <input
                    type="text"
                    value={quoteFormData.customerName}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, customerName: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Agregar Producto</label>
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-5">
                      <select
                        value={quoteItemForm.productId}
                        onChange={(e) => setQuoteItemForm({ ...quoteItemForm, productId: e.target.value, formatName: '' })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      >
                        <option value="">Producto...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-4">
                      <select
                        value={quoteItemForm.formatName}
                        onChange={(e) => setQuoteItemForm({ ...quoteItemForm, formatName: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        disabled={!quoteItemForm.productId}
                      >
                        <option value="">Formato...</option>
                        {products.find(p => p.id === quoteItemForm.productId)?.saleFormats.map(f => (
                          <option key={f.name} value={f.name}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={quoteItemForm.quantity}
                        onChange={(e) => setQuoteItemForm({ ...quoteItemForm, quantity: parseInt(e.target.value) })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        min="1"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={handleQuoteItemAdd}
                        className="w-full h-full flex items-center justify-center bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {quoteFormData.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xs shadow-sm">
                            {item.quantity}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{products.find(p => p.id === item.productId)?.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{item.formatName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(item.price * item.quantity, theme.currency)}</p>
                          <button 
                            onClick={() => {
                              const newItems = quoteFormData.items.filter((_, i) => i !== idx);
                              const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                              setQuoteFormData({ ...quoteFormData, items: newItems, total: newTotal });
                            }}
                            className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notas / Condiciones</label>
                  <textarea
                    value={quoteFormData.notes}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, notes: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all text-sm"
                    rows={3}
                    placeholder="Ej: Validez de 15 días, entrega incluida..."
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Estimado</p>
                    <p className="text-3xl font-black text-primary">{formatCurrency(quoteFormData.total, theme.currency)}</p>
                  </div>
                  <div className="flex gap-2">
                    {editingQuote && (
                      <button
                        onClick={() => generateQuotePDF({ ...editingQuote, ...quoteFormData })}
                        className="p-4 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all shadow-sm"
                        title="Descargar PDF"
                      >
                        <Download className="w-6 h-6" />
                      </button>
                    )}
                    <button
                      onClick={handleSaveQuote}
                      className="px-8 py-4 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all shadow-lg active:scale-[0.98] flex-1"
                    >
                      {editingQuote ? 'Guardar Cambios' : 'Generar Cotización'}
                    </button>
                  </div>
                </div>
        </div>
      </Modal>

      {/* Purchase Modal (IA Review) */}
      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title="Validar Boleta (IA)"
        description="Vincula los productos y apaga el consumo personal."
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proveedor</label>
                    <input
                      type="text"
                      value={purchaseFormData.supplierName}
                      onChange={(e) => setPurchaseFormData({ ...purchaseFormData, supplierName: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha</label>
                    <input
                      type="date"
                      value={purchaseFormData.date}
                      onChange={(e) => setPurchaseFormData({ ...purchaseFormData, date: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                     <Sparkles className="w-3 h-3 text-emerald-500" />
                     Productos Extraídos → "Apaga" el consumo personal
                  </label>
                  <div className="space-y-3">
                    {(purchaseFormData.items || []).map((item, idx) => (
                      <div key={idx} className={cn(
                        "p-4 rounded-2xl border transition-all relative overflow-hidden",
                        item.isExcluded ? "bg-slate-50 border-slate-200 grayscale opacity-40 scale-[0.98]" : "bg-emerald-50/20 border-emerald-100/50 shadow-sm"
                      )}>
                        <div className="flex justify-between items-start mb-3 gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">{item.rawName}</p>
                            <p className="text-[10px] text-gray-500 font-medium font-mono">
                              {item.quantity} {item.unit} @ {formatCurrency(item.price / item.quantity, theme.currency)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <p className="font-black text-primary tabular-nums">{formatCurrency(item.price, theme.currency)}</p>
                            <button
                              onClick={() => {
                                const newItems = [...(purchaseFormData.items || [])];
                                newItems[idx] = { ...newItems[idx], isExcluded: !newItems[idx].isExcluded };
                                const newSubtotal = newItems.reduce((sum, i) => sum + (i.isExcluded ? 0 : i.price), 0);
                                setPurchaseFormData({ 
                                  ...purchaseFormData, 
                                  items: newItems, 
                                  subtotal: newSubtotal,
                                  total: Math.max(0, newSubtotal - purchaseFormData.discount)
                                });
                              }}
                              className={cn(
                                "p-2 rounded-xl transition-all shadow-sm",
                                item.isExcluded ? "bg-slate-200 text-slate-500" : "bg-white text-emerald-600 hover:text-emerald-700 hover:shadow"
                              )}
                            >
                              {item.isExcluded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vincular con Insumo de la Pastelería</label>
                          <SearchableSelect
                            options={supplies.map(s => ({ id: s.id, name: s.name, group: s.category }))}
                            value={item.inventoryItemId || ''}
                            onChange={(id) => {
                              const newItems = [...(purchaseFormData.items || [])];
                              newItems[idx] = { ...newItems[idx], inventoryItemId: id };
                              setPurchaseFormData({ ...purchaseFormData, items: newItems });
                            }}
                            placeholder="Sin vincular..."
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                     Gasto Negocio ({purchaseFormData.items?.filter(i => !i.isExcluded).length} de {purchaseFormData.items?.length} items)
                  </span>
                  <p className="text-2xl font-black text-slate-900 drop-shadow-sm">{formatCurrency(purchaseFormData.total || 0, theme.currency)}</p>
                </div>
                <button
                  onClick={handleSavePurchase}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:shadow-primary/20 hover:opacity-95 transition-all active:scale-[0.98] uppercase tracking-wider text-sm"
                >
                  Confirmar Compra del Negocio
                </button>
              </div>
      </Modal>

      {/* Notification System */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-100 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl"
          >
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              notification.type === 'success' ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
            )} />
            <span className="text-sm font-bold tracking-tight">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Voice Recipe Modal */}
      <VoiceRecipeModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onProcess={handleVoiceRecipeImport}
        isProcessing={isImporting}
      />
      </>
    </ErrorBoundary>
  );
}
