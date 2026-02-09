export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  isGrayscale?: boolean;
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
