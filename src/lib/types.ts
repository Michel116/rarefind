
export interface Brand {
  id: string;
  name: string;
}

export interface Size {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number; // Percentage, e.g., 10 for 10%
  brandId: string;
  image: string; // URL to image
  sizes: string[]; // Array of Size IDs available for this product
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreSettings {
  isStoreClosed: boolean;
  logoUrl: string | null; // Allow null for logo
}

// User Profile and Order History
export interface User {
  id: string;
  name: string;
  telegramId?: string;
  email?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerItem: number;
  image: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'processing'
  | 'awaiting_shipment'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'awaiting_confirmation';

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  orderDate: Date;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Item Type
export interface CartItemType {
  product: Product;
  quantity: number;
}
