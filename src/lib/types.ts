export interface Product {
  id: string;
  name: string;
  brand: string;
  size: string[]; // e.g., ['S', 'M', 'L', 'Единый размер']
  price: number;
  imageUrl: string;
  description: string;
  availableSizes: string[]; // Actual available sizes for this product
  dataAiHint?: string; // Optional AI hint for image generation
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
// Russian counterparts for display, data uses English for consistency with getStatusBadgeVariant
// 'В ожидании' | 'Отправлен' | 'Доставлен' | 'Отменен';

export interface Order {
  id: string;
  date: string; // ISO date string
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
}
