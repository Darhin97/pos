export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  isGrayscale?: boolean;
  // Additional fields for product management
  sku?: string;
  brand?: string;
  supplier?: string;
  stock?: number | "∞";
  active?: boolean;
  createdAt?: string;
  variants?: number;
  // Metadata for variant products
  _metadata?: {
    productType?: "standard" | "variant";
    tags?: string[];
    description?: string;
    supplierPrice?: number;
    markup?: number;
    margin?: number;
    variantData?: Array<{
      id: number;
      name: string;
      skuCode: string;
      quantity: string;
      supplierPrice: string;
      retailPrice: string;
      enabled: boolean;
    }>;
    attributes?: Array<{
      id: number;
      name: string;
      values: string[];
    }>;
  };
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  size: string;
  color: string | null;
  qty: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  customerId: string;
  tags: string[];
}

export interface HeldSale {
  id: string;
  reason: string;
  items: CartItem[];
  customer: Customer | null;
  timestamp: number;
}

export interface QuoteItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface Quote {
  id: number;
  quoteNumber: string;
  customer: Customer;
  servedBy: {
    name: string;
    outlet: string;
  };
  note?: string;
  total: number;
  status: "Open" | "Closed" | "Expired" | "Converted";
  items: QuoteItem[];
  createdAt: number;
  discount?: {
    type: "percentage" | "amount";
    value: number;
  };
  promoCode?: string;
  subtotal: number;
  tax: number;
}

export interface NewCustomerForm {
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  quoteNote?: string;
}

export interface QuoteCreationData {
  customer: Customer | NewCustomerForm;
  isNew: boolean;
  quoteNote?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  discount?: {
    type: "percentage" | "amount";
    value: number;
  };
  promoCode?: string;
  tax: number;
}

export type ShiftStatus = "open" | "closed";

export type PaymentMethod = "cash" | "card" | "mobile" | "other";

export interface RegisterShift {
  id: string;
  register_id: string;
  cashier_id: string;
  tenant_id: string;
  opened_at: number;
  opened_by: string;
  opening_float: number;
  opening_notes?: string;
  closed_at?: number;
  closed_by?: string;
  closing_cash?: number;
  expected_cash?: number;
  closing_notes?: string;
  status: ShiftStatus;
  sales_total: number;
  transaction_count: number;
  discrepancy?: number;
}

export interface PaymentBreakdown {
  cash: number;
  card: number;
  mobile: number;
  other: number;
}

export interface ShiftSummary {
  shift_id: string;
  opening_float: number;
  sales_total: number;
  expected_cash: number;
  actual_cash?: number;
  discrepancy?: number;
  transaction_count: number;
  payment_breakdown: PaymentBreakdown;
  opened_at: number;
  closed_at?: number;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  productCount: number;
}

export interface Tag {
  id: number;
  name: string;
  productCount: number;
}

export interface Category {
  id: number;
  name: string;
  productCount: number;
}

export interface Supplier {
  id: number;
  name: string;
  description?: string;
  representative?: string;
  contact?: string;
  productCount: number;
}

export interface ProductFilter {
  type: "tag" | "category" | "brand" | "supplier" | "sku";
  operator: "include" | "exclude";
  values: string[];
}

export interface Promotion {
  id: number;
  tenant_id?: string;
  name: string;
  description: string;
  scheduleType: "one-time" | "recurring";
  // One-time schedule
  startDate?: string;
  endDate?: string;
  // Recurring schedule
  daysOfWeek?: number[]; // [0-6] Sunday-Saturday
  discountType: "percentage" | "fixed";
  discountValue: number;
  productScope: "all" | "specific";
  productFilters?: ProductFilter[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  status?: "current" | "upcoming" | "past";
}
