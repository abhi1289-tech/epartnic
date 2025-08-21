export type UserRole = 'customer' | 'partner' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  companyName?: string;
  createdAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
  images: string[];
  price: number;
  stock: number;
  category: string;
  attributes?: Record<string, string>;
  featured?: boolean;
  description?: string;
  createdAt: Date;
  partnerId?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  maxQty: number;
  sku?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';

export interface PaymentInfo {
  provider: 'mock' | 'razorpay' | 'cod';
  status: 'created' | 'success' | 'failed';
  txnId?: string;
  amount?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  address: Address;
  status: OrderStatus;
  payment: PaymentInfo;
  createdAt: Date;
  updatedAt?: Date;
}

export interface FilterOptions {
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  vehicle?: {
    make?: string;
    model?: string;
    year?: number;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}