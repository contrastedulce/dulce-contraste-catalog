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
  name?: string; // Original parsed name from text/AI
  originalQuantity?: number; // AI extracted quantity
  originalUnit?: string;      // AI extracted unit (e.g. cda, taza)
}

export interface IngredientMapping {
  rawName: string;          // Extracted name (lowercase)
  supplyId?: string;
  recipeId?: string;
  originalUnit?: string;    // E.g., 'cda', 'taza'
  equivalenceRatio?: number; // How many inventory units per original unit
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
  inEbook?: boolean; // Legacy field - kept for data compatibility
  instructions?: string[];
  image?: string;
  pdfPath?: string;
  pdfPage?: number;
  orderIndex?: number;
  rawText?: string;
  author?: string | null;
  generatedSubRecipes?: Recipe[];
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
    includeIgv?: boolean;
    igvRate?: number;
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
  businessName?: string;
  whatsappPhone?: string;
  agendaStatus?: 'open' | 'limited' | 'closed';
  agendaMessage?: string;
  deliveryZones: { name: string; cost: number; description?: string }[];
  freeDeliveryThreshold?: number;
  masterCosts: MasterCosts;
  professorColors?: { name: string; color: string }[];
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
    /** Si el precio base ya incluye IGV (se muestra desglosado en el PDF) */
    priceIncludesIgv?: boolean;
    /** % de IGV aplicado a esta línea (SUNAT Perú = 18) */
    igvRate?: number;
  }[];
  total: number;
  notes?: string;
  /** Ciudad que aparece en la cabecera del PDF (ej: "Piura") */
  city?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  /** Fecha límite de vigencia de la cotización (editable) */
  validUntil?: string;
  /** Rango horario de entrega (por defecto "10 am a 12 pm") */
  deliveryWindow?: string;
  /** Activa el bloque de descuento en el PDF */
  discountEnabled?: boolean;
  /** Texto del descuento (ej: "DESCUENTO ESPECIAL CORPORATIVO") */
  discountLabel?: string;
  /** Porcentaje de descuento, ej: 8 */
  discountPercent?: number;
  /** Términos y condiciones personalizados (si se omite, se usan los por defecto) */
  terms?: string[];
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
