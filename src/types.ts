export interface Supply {
  id: string;
  name: string;
  unit: string;
  cost: number;
  category: 'Secos' | 'Lácteos' | 'Frescos' | 'Packaging';
  stock: number;
  minStock: number;
  lastCostUpdate?: string; // ISO date
}

export interface Equipment {
  id: string;
  name: string;
  purchasePrice: number;
  usefulLifeYears: number;
  maintenanceCostMonthly: number;
  operatingHoursMonthly: number;
  powerWatts: number;
  hourlyCost?: number;
}

export interface RecipeIngredient {
  id?: string;
  supplyId?: string;
  recipeId?: string; // For sub-recipes
  quantity: number;
  isFixed?: boolean;
}

export interface RecipeEquipment {
  equipmentId: string;
  hoursUsed: number;
  wattsUsed?: number;
}

export interface MasterCosts {
  salaries: {
    heavy: { monthly: number; hoursPerMonth: number };
    light: { monthly: number; hoursPerMonth: number };
  };
  services: {
    electricity: { monthly: number; usagePercent: number };
    water: { monthly: number; usagePercent: number };
    gas: { monthly: number; usagePercent: number };
    rent: { monthly: number; usagePercent: number };
    machinery: { monthly: number; usagePercent: number };
    utensils: { monthly: number; usagePercent: number };
  };
  taxes: {
    igv: number;
    salesTax: number;
  };
  kwhPrice?: number;
}

export interface Recipe {
  id: string;
  name: string;
  type: 'sub' | 'complete';
  ingredients: RecipeIngredient[];
  equipment: RecipeEquipment[];
  laborCost: number; // Keep for backward compatibility or legacy
  laborMinutes?: { heavy: number; light: number };
  serviceMinutes?: { 
    electricity: number; 
    water: number; 
    gas: number; 
    machinery: number;
    utensils?: number;
  };
  extraCosts?: { biosecurity: number; packaging: number };
  yield: number; // portions or weight
  yieldUnit: string; // e.g., "gr", "kg", "unidades"
  totalCost?: number;
  costPerPortion?: number;
  catalogCategory?: 'Base' | 'Relleno' | 'Cubierta' | 'Ninguno';
}

export interface Product {
  id: string;
  name: string;
  recipeId: string;
  type: 'single' | 'combo';
  saleFormats: {
    name: string; // e.g., "Unidad", "Docena"
    multiplier: number;
    divisor?: number;
    price: number;
    extraSupplies?: { supplyId: string; quantity: number }[];
    availability?: 'in_stock' | 'on_order';
    leadTime?: string;
    image?: string;
  }[];
  margin: number;
  image?: string;
  description?: string;
  tags?: string[];
  category?: string;
  categoryGroup?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  discountPrice?: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: { 
    productId: string; 
    formatName: string; 
    quantity: number; 
    price: number;
  }[];
  status: 'pending' | 'preparing' | 'delivered' | 'delivered_credit' | 'delivered_paid';
  date: string;
  deliveryDate?: string; // ISO date
  deliveryTime?: string;
  deliveryAddress?: string;
  deliveryZone?: string;
  gpsLocation?: string;
  taxData?: {
    documentType: 'nota' | 'boleta' | 'factura';
    documentNumber: string;
    businessName?: string;
  };
  total: number;
  notes?: string;
  source?: 'admin' | 'catalog';
}

export interface AppSettings {
  primaryColor: string;
  borderRadius: string;
  currency: string;
  language: string;
  whatsappPhone?: string;
  agendaStatus?: 'open' | 'limited' | 'closed';
  agendaMessage?: string;
  deliveryZones: { name: string; cost: number; description?: string }[];
  freeDeliveryThreshold?: number;
  masterCosts: MasterCosts;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  suppliesExpense: number;
  laborExpense: number;
  equipmentExpense: number;
  totalCredit: number;
  netProfit: number;
}

export interface Quote {
  id: string;
  customerName: string;
  date: string;
  items: {
    productId: string;
    formatName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  notes?: string;
}

export interface PurchaseItem {
  rawName: string;
  quantity: number;
  unit: string;
  price: number;
  inventoryItemId?: string;
  isExcluded?: boolean;
}

export interface Purchase {
  id: string;
  date: string;
  supplierName: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'completed';
  imagePath?: string;
}

export interface SupplierMapping {
  id: string;
  supplierName: string;
  rawName: string;
  inventoryItemId: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  notes?: string;
  favoriteProducts?: string[]; // IDs
}
