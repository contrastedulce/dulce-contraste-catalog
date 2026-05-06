import { 
  LayoutDashboard, 
  Package, 
  ChefHat, 
  ShoppingCart, 
  BarChart3, 
  Wrench,
  Sparkles,
  Settings,
  FileText,
  Wallet,
  Users,
  ListChecks
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'inventory', label: 'Insumos', icon: Package },
  { id: 'recipes', label: 'Recetas', icon: ChefHat },
  { id: 'products', label: 'Productos', icon: Sparkles },
  { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
  { id: 'shopping-list', label: 'Lista Compras', icon: ListChecks },
  { id: 'customers', label: 'Clientes', icon: Users },
  { id: 'purchases', label: 'Compras', icon: Wallet },
  { id: 'equipment', label: 'Equipos', icon: Wrench },
  { id: 'finances', label: 'Finanzas', icon: BarChart3 },
  { id: 'quotes', label: 'Cotizador', icon: FileText },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];
