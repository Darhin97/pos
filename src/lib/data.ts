import { Product, CartItem, Customer, Quote, Brand, Tag, Category, Supplier, Promotion } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Chocolate Brownie",
    sku: "10013",
    price: 4.50,
    category: "Bakery",
    image:
      "https://cdn.pixabay.com/photo/2016/03/27/22/38/cake-1284548_1280.jpg",
    sizes: [],
    colors: [],
    brand: "-",
    supplier: "Nanna's Kitchen",
    stock: 3,
    active: true,
    createdAt: "Feb 17, 2026",
  },
  {
    id: 2,
    name: "Flat White Coffee",
    sku: "10014",
    price: 3.50,
    category: "Beverages",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/12/54/cafe-1869656_1280.jpg",
    sizes: [],
    colors: [],
    brand: "-",
    supplier: "Jimmys Roasting Beans",
    stock: "∞",
    active: true,
    createdAt: "Feb 17, 2026",
    variants: 8,
  },
  {
    id: 3,
    name: "Freshly Squeezed Juice",
    sku: "10012",
    price: 5.50,
    category: "Beverages",
    image:
      "https://cdn.pixabay.com/photo/2017/05/01/05/18/pastry-2274750_1280.jpg",
    sizes: [],
    colors: [],
    brand: "-",
    supplier: "Summer Sun",
    stock: 31,
    active: true,
    createdAt: "Feb 17, 2026",
  },
  {
    id: 4,
    name: "Denim Fabric Jacket",
    sku: "10001",
    price: 45.95,
    category: "Men",
    image:
      "https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_1280.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["bg-slate-900", "bg-stone-300"],
    brand: "Urban",
    supplier: "Fashion Hub",
    stock: 12,
    active: true,
    createdAt: "Feb 15, 2026",
  },
  {
    id: 5,
    name: "Basic Cropped T-Shirt",
    sku: "10002",
    price: 17.9,
    category: "Men",
    image:
      "https://cdn.pixabay.com/photo/2016/12/06/09/30/blank-1886001_1280.png",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["bg-stone-800", "bg-stone-500", "bg-amber-100", "bg-white"],
    brand: "Basics Co",
    supplier: "Fashion Hub",
    stock: 45,
    active: true,
    createdAt: "Feb 14, 2026",
  },
  {
    id: 6,
    name: "STWD Raincoat with Hood",
    sku: "10003",
    price: 49.9,
    category: "Men",
    image:
      "https://cdn.pixabay.com/photo/2017/08/01/00/38/man-2562325_1280.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["bg-stone-300"],
    isGrayscale: true,
    brand: "STWD",
    supplier: "Outdoor Gear",
    stock: 8,
    active: false,
    createdAt: "Feb 12, 2026",
  },
  {
    id: 7,
    name: "Short Dress Asymetric",
    sku: "10004",
    price: 29.9,
    category: "Women",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/09/38/adult-1868750_1280.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["bg-stone-900", "bg-stone-600", "bg-red-600"],
    brand: "Elegance",
    supplier: "Fashion Hub",
    stock: 22,
    active: true,
    createdAt: "Feb 10, 2026",
  },
  {
    id: 8,
    name: "Flowing Pinstripe Pants",
    sku: "10005",
    price: 49.9,
    category: "Women",
    image:
      "https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2563491_1280.jpg",
    sizes: ["US 0", "US 2", "US 4", "US 6"],
    colors: ["bg-stone-200", "bg-stone-100"],
    brand: "Chic",
    supplier: "Textile World",
    stock: 15,
    active: true,
    createdAt: "Feb 8, 2026",
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

export const BRANDS: Brand[] = [
  {
    id: 1,
    name: "Mars",
    description: "",
    productCount: 2,
  },
  {
    id: 2,
    name: "Urban",
    description: "Modern urban streetwear and casual fashion",
    productCount: 1,
  },
  {
    id: 3,
    name: "Basics Co",
    description: "Essential everyday clothing basics",
    productCount: 1,
  },
  {
    id: 4,
    name: "STWD",
    description: "Outdoor and weather protection apparel",
    productCount: 1,
  },
  {
    id: 5,
    name: "Elegance",
    description: "Sophisticated and elegant fashion pieces",
    productCount: 1,
  },
  {
    id: 6,
    name: "Chic",
    description: "Contemporary chic fashion for modern lifestyle",
    productCount: 1,
  },
];

export const TAGS: Tag[] = [
  {
    id: 1,
    name: "New Arrival",
    productCount: 3,
  },
  {
    id: 2,
    name: "Sale",
    productCount: 2,
  },
  {
    id: 3,
    name: "Featured",
    productCount: 4,
  },
  {
    id: 4,
    name: "Bestseller",
    productCount: 5,
  },
  {
    id: 5,
    name: "Seasonal",
    productCount: 2,
  },
  {
    id: 6,
    name: "Limited Edition",
    productCount: 1,
  },
];

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Bakery",
    productCount: 1,
  },
  {
    id: 2,
    name: "Beverages",
    productCount: 2,
  },
  {
    id: 3,
    name: "Men",
    productCount: 3,
  },
  {
    id: 4,
    name: "Women",
    productCount: 2,
  },
  {
    id: 5,
    name: "Accessories",
    productCount: 0,
  },
];

export const SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "Nanna's Kitchen",
    description: "Artisanal bakery and confectionery supplier",
    representative: "Anna Thompson",
    contact: "+233 24 123 4567",
    productCount: 1,
  },
  {
    id: 2,
    name: "Jimmys Roasting Beans",
    description: "Premium coffee roasters and beverage suppliers",
    representative: "Jimmy Martinez",
    contact: "+233 24 234 5678",
    productCount: 1,
  },
  {
    id: 3,
    name: "Summer Sun",
    description: "Fresh juice and beverage distributor",
    representative: "Sarah Williams",
    contact: "+233 24 345 6789",
    productCount: 1,
  },
  {
    id: 4,
    name: "Fashion Hub",
    description: "Wholesale fashion and apparel supplier",
    representative: "David Chen",
    contact: "+233 24 456 7890",
    productCount: 3,
  },
  {
    id: 5,
    name: "Outdoor Gear",
    description: "Outdoor and weather protection apparel",
    representative: "Michael Brown",
    contact: "+233 24 567 8901",
    productCount: 1,
  },
  {
    id: 6,
    name: "Textile World",
    description: "Quality textile and fabric supplier",
    representative: "Emily Davis",
    contact: "+233 24 678 9012",
    productCount: 1,
  },
];

export const PROMOTIONS: Promotion[] = [
  {
    id: 1,
    name: "Weekend Flash Sale",
    description: "15% off all items this weekend",
    scheduleType: "one-time",
    startDate: "2026-03-06",
    endDate: "2026-03-08",
    discountType: "percentage",
    discountValue: 15,
    productScope: "all",
    active: true,
    createdAt: "2026-03-01",
    status: "upcoming",
  },
  {
    id: 2,
    name: "Tuesday Special",
    description: "GH₵5 off on beverages every Tuesday",
    scheduleType: "recurring",
    daysOfWeek: [2], // Tuesday
    discountType: "fixed",
    discountValue: 5,
    productScope: "specific",
    productFilters: [
      {
        type: "category",
        operator: "include",
        values: ["Beverages"],
      },
    ],
    active: true,
    createdAt: "2026-02-20",
    status: "current",
  },
  {
    id: 3,
    name: "Weekend Fashion Discount",
    description: "20% off men's and women's clothing",
    scheduleType: "recurring",
    daysOfWeek: [5, 6], // Friday, Saturday
    discountType: "percentage",
    discountValue: 20,
    productScope: "specific",
    productFilters: [
      {
        type: "category",
        operator: "include",
        values: ["Men", "Women"],
      },
    ],
    active: true,
    createdAt: "2026-02-15",
    status: "current",
  },
];
