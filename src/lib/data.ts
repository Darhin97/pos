import { Product, CartItem, Customer, Quote } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Denim Fabric Jacket",
    price: 45.95,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["bg-slate-900", "bg-stone-300"],
  },
  {
    id: 2,
    name: "Basic Cropped T-Shirt",
    price: 17.9,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["bg-stone-800", "bg-stone-500", "bg-amber-100", "bg-white"],
  },
  {
    id: 3,
    name: "STWD Raincoat with Hood",
    price: 49.9,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
    sizes: ["S", "M", "L", "XL"],
    colors: ["bg-stone-300"],
    isGrayscale: true,
  },
  {
    id: 4,
    name: "Short Dress Asymetric",
    price: 29.9,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=400&q=80",
    sizes: ["S", "M", "L", "XL"],
    colors: ["bg-stone-900", "bg-stone-600", "bg-red-600"],
  },
  {
    id: 5,
    name: "Flowing Pinstripe Pants",
    price: 49.9,
    category: "Women",
    image:
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
    sizes: ["US 0", "US 2", "US 4", "US 6"],
    colors: ["bg-stone-200", "bg-stone-100"],
  },
  {
    id: 6,
    name: "Half-Moon Crossbody Bag",
    price: 29.9,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80",
    sizes: ["M"],
    colors: ["bg-black", "bg-stone-400"],
  },
];

export const CART_ITEMS: CartItem[] = [
  {
    id: 101,
    name: "Denim Fabric Jacket",
    price: 45.95,
    category: "Men",
    size: "M",
    color: "BW",
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 102,
    name: "Necklace Lightning Bolt",
    price: 8.9,
    category: "Accessories",
    size: "M",
    color: null,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 103,
    name: "Rubberized Fanny Pack",
    price: 27.9,
    category: "Accessories",
    size: "M",
    color: null,
    qty: 1,
    image:
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg",
  },
];

export const CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Jimmy Koln",
    email: "test123@email.com",
    customerId: "Jimmy-X7PM",
    tags: ["All customers"],
  },
  {
    id: "2",
    name: "Jimmy Sanders",
    email: "jsanders@email.com",
    customerId: "Jimmy-K2LM",
    tags: ["All customers", "VIP"],
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sjohnson@email.com",
    customerId: "Sarah-P9XN",
    tags: ["All customers"],
  },
  {
    id: "4",
    name: "Michael Chen",
    email: "mchen@email.com",
    customerId: "Michael-L5RT",
    tags: ["All customers", "Regular"],
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "ewilson@email.com",
    customerId: "Emma-M3QW",
    tags: ["All customers", "VIP"],
  },
];

export const QUOTES: Quote[] = [
  {
    id: 1,
    quoteNumber: "1",
    customer: {
      id: "6",
      name: "Jimmy Green",
      email: "test@mail.com",
      customerId: "Jimmy-84CC",
      tags: ["All customers"],
    },
    servedBy: {
      name: "john brown",
      outlet: "Main Branch",
    },
    note: "",
    subtotal: 880.0,
    total: 880.0,
    tax: 0,
    status: "Open",
    items: [
      { id: 1, name: "Denim Fabric Jacket", price: 45.95, qty: 2 },
      { id: 2, name: "Short Dress Asymetric", price: 29.9, qty: 3 },
    ],
    createdAt: new Date("2026-02-18T19:04:00").getTime(),
  },
  {
    id: 2,
    quoteNumber: "2",
    customer: {
      id: "3",
      name: "Sarah Johnson",
      email: "sjohnson@email.com",
      customerId: "Sarah-P9XN",
      tags: ["All customers"],
    },
    servedBy: {
      name: "john brown",
      outlet: "Main Branch",
    },
    note: "Bulk order discount requested",
    subtotal: 349.5,
    total: 349.5,
    tax: 0,
    status: "Open",
    items: [
      { id: 3, name: "Basic Cropped T-Shirt", price: 17.9, qty: 5 },
      { id: 5, name: "Flowing Pinstripe Pants", price: 49.9, qty: 4 },
    ],
    createdAt: new Date("2026-02-17T14:22:00").getTime(),
  },
  {
    id: 3,
    quoteNumber: "3",
    customer: {
      id: "5",
      name: "Emma Wilson",
      email: "ewilson@email.com",
      customerId: "Emma-M3QW",
      tags: ["All customers", "VIP"],
    },
    servedBy: {
      name: "alice kim",
      outlet: "West Branch",
    },
    note: "",
    subtotal: 119.7,
    total: 119.7,
    tax: 0,
    status: "Closed",
    items: [
      { id: 6, name: "Half-Moon Crossbody Bag", price: 29.9, qty: 4 },
    ],
    createdAt: new Date("2026-02-15T10:00:00").getTime(),
  },
];
