
import type { Product, Brand, Size, StoreSettings, User, Order, OrderItem, CartItemType } from './types';
import { z } from 'zod';
import { unstable_noStore as noStore } from 'next/cache';

// Mock Data Store (in-memory)
let brands: Brand[] = [
  { id: '1', name: 'CasualWear' },
  { id: '2', name: 'UrbanStyle' },
  { id: '3', name: 'SportPro' },
  { id: '4', name: 'Eleganza' },
];

let sizes: Size[] = [
  { id: 's', name: 'S' },
  { id: 'm', name: 'M' },
  { id: 'l', name: 'L' },
  { id: 'xl', name: 'XL' },
  { id: 'xxl', name: 'XXL' },
];

let products: Product[] = [
  {
    id: 'p1',
    name: "Футболка 'Классика'",
    description: 'Удобная хлопковая футболка на каждый день. Идеально подходит для повседневной носки.',
    price: 2500,
    discount: 10,
    brandId: '1',
    image: null,
    sizes: ['s', 'm', 'l'],
    createdAt: new Date('2023-01-10T10:00:00Z'),
    updatedAt: new Date('2023-01-10T10:00:00Z'),
  },
  {
    id: 'p2',
    name: "Джинсы 'Свобода'",
    description: 'Стильные джинсы свободного кроя. Подчеркнут вашу индивидуальность.',
    price: 4800,
    brandId: '2',
    image: null,
    sizes: ['m', 'l', 'xl'],
    createdAt: new Date('2023-01-11T11:00:00Z'),
    updatedAt: new Date('2023-01-11T11:00:00Z'),
  },
  {
    id: 'p3',
    name: "Кроссовки 'Скорость'",
    description: 'Легкие и удобные кроссовки для активного образа жизни и занятий спортом.',
    price: 6200,
    discount: 15,
    brandId: '3',
    image: null,
    sizes: ['s', 'm', 'l', 'xl'],
    createdAt: new Date('2023-01-12T12:00:00Z'),
    updatedAt: new Date('2023-01-12T12:00:00Z'),
  },
   {
    id: 'p4',
    name: "Платье 'Вечер'",
    description: 'Элегантное вечернее платье для особых случаев. Вы будете неотразимы.',
    price: 8900,
    brandId: '4',
    image: null,
    sizes: ['s', 'm'],
    createdAt: new Date('2023-01-13T13:00:00Z'),
    updatedAt: new Date('2023-01-13T13:00:00Z'),
  },
  {
    id: 'p5',
    name: "Худи 'Комфорт'",
    description: 'Теплое и мягкое худи для прохладной погоды. Отличный выбор для уюта.',
    price: 3500,
    brandId: '1',
    image: null,
    sizes: ['m', 'l', 'xl', 'xxl'],
    createdAt: new Date('2023-01-14T14:00:00Z'),
    updatedAt: new Date('2023-01-14T14:00:00Z'),
  },
];

let storeSettings: StoreSettings = {
  isStoreClosed: false,
  logoUrl: 'https://i.pinimg.com/736x/25/d3/93/25d3934d80bc6b834f0b37050840a26e.jpg',
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);
const generateOrderNumber = () => `RF${Math.floor(Math.random() * 90000) + 10000}`;

let mockUser: User = {
  id: 'user123',
  name: 'Иван Иванов',
  telegramId: 'ivan_telegram',
  email: 'ivan@example.com',
};

let orders: Order[] = [
  {
    id: generateId(),
    userId: 'user123',
    orderNumber: generateOrderNumber(),
    orderDate: new Date('2024-05-01T10:30:00Z'),
    items: [
      { productId: 'p1', productName: "Футболка 'Классика'", quantity: 1, pricePerItem: 2250, image: products.find(p => p.id === 'p1')?.image || "https://placehold.co/80x100.png" },
    ],
    totalAmount: 2250,
    status: 'delivered',
    shippingAddress: 'г. Москва, ул. Примерная, д. 1, кв. 2',
    trackingNumber: 'RU123456789HK',
    createdAt: new Date('2024-05-01T10:30:00Z'),
    updatedAt: new Date('2024-05-03T15:00:00Z'),
  },
];

// --- Read Data Functions ---
export const getProducts = async (filters?: { brandId?: string; sizeId?: string }): Promise<Product[]> => {
  noStore();
  let filteredProducts = products;
  if (filters?.brandId) {
    filteredProducts = filteredProducts.filter(p => p.brandId === filters.brandId);
  }
  if (filters?.sizeId) {
    filteredProducts = filteredProducts.filter(p => p.sizes.includes(filters.sizeId as string));
  }
  return JSON.parse(JSON.stringify(filteredProducts));
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  noStore();
  const product = products.find(p => p.id === id);
  return product ? JSON.parse(JSON.stringify(product)) : undefined;
};

export const getBrands = async (): Promise<Brand[]> => {
  noStore();
  return JSON.parse(JSON.stringify(brands));
};

export const getBrandById = async (id: string): Promise<Brand | undefined> => {
  noStore();
  const brand = brands.find(b => b.id === id);
  return brand ? JSON.parse(JSON.stringify(brand)) : undefined;
};

export const getSizes = async (): Promise<Size[]> => {
  noStore();
  return JSON.parse(JSON.stringify(sizes));
};

export const getSizeById = async (id: string): Promise<Size | undefined> => {
  noStore();
  const size = sizes.find(s => s.id === id);
  return size ? JSON.parse(JSON.stringify(size)) : undefined;
};

export const getStoreSettings = async (): Promise<StoreSettings> => {
  noStore();
  return JSON.parse(JSON.stringify(storeSettings));
};

export const getBrandNameById = (brandId: string): string => {
  noStore();
  const brand = brands.find(b => b.id === brandId);
  return brand ? brand.name : 'Неизвестный бренд';
};

export const getMockUser = async (userId: string): Promise<User | undefined> => {
  noStore();
  if (userId === mockUser.id) {
    return JSON.parse(JSON.stringify(mockUser));
  }
  return undefined;
};

export const getOrderHistory = async (userId: string): Promise<Order[]> => {
  noStore();
  const userOrders = orders.filter(order => order.userId === userId).sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  return JSON.parse(JSON.stringify(userOrders));
};

export const createMockOrder = async (userId: string, cartItems: CartItemType[]): Promise<Order> => {
  noStore();
  const newOrderItems: OrderItem[] = cartItems.map(item => {
    const priceAtPurchase = item.product.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return {
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      pricePerItem: Math.round(priceAtPurchase),
      image: item.product.image || "https://placehold.co/80x100.png",
    };
  });
  const totalAmount = newOrderItems.reduce((total, item) => total + (item.pricePerItem * item.quantity), 0);
  const newOrder: Order = {
    id: generateId(),
    userId: userId,
    orderNumber: generateOrderNumber(),
    orderDate: new Date(),
    items: newOrderItems,
    totalAmount: totalAmount,
    status: 'awaiting_confirmation',
    shippingAddress: 'г. Москва, ул. Примерная, д. 1, кв. 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  orders.unshift(newOrder); // Add to the beginning of the array
  return JSON.parse(JSON.stringify(newOrder));
};

// --- Admin Data Modification Functions ---

export const dbUpdateStoreSettings = (newSettings: Partial<StoreSettings>): StoreSettings => {
  storeSettings = { ...storeSettings, ...newSettings };
  return JSON.parse(JSON.stringify(storeSettings));
};

export const dbAddProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const newProduct: Product = {
    ...productData,
    id: generateId(),
    image: productData.image || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  products = [...products, newProduct]; // Immutable update
  return JSON.parse(JSON.stringify(newProduct));
};

export const dbUpdateProduct = (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'brandId'> & { brandId: string }>): Product | null => {
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) return null;

  const updatedProductData = {
    ...products[productIndex],
    ...productData,
    image: productData.image === undefined ? products[productIndex].image : (productData.image || null),
    updatedAt: new Date(),
  };
  
  products = products.map(p => (p.id === id ? updatedProductData : p)); // Immutable update
  return JSON.parse(JSON.stringify(updatedProductData));
};

export const dbDeleteProduct = (id: string): boolean => {
  const initialLength = products.length;
  products = products.filter(p => p.id !== id); // This is already an immutable update
  return products.length < initialLength;
};

export const getOrCreateBrandByName = (name: string): Brand => {
  noStore(); // Ensure we always work with the freshest list of brands
  const trimmedName = name.trim();
  let existingBrand = brands.find(b => b.name.toLowerCase() === trimmedName.toLowerCase());
  if (existingBrand) {
    return JSON.parse(JSON.stringify(existingBrand));
  }
  const newBrand: Brand = { id: generateId(), name: trimmedName };
  brands = [...brands, newBrand]; // Immutable update for brands array
  return JSON.parse(JSON.stringify(newBrand));
};

export const dbAddBrand = (brandData: Omit<Brand, 'id'>): Brand | { error: string } => {
  noStore();
  if (brands.some(b => b.name.toLowerCase() === brandData.name.toLowerCase())) {
    return { error: "Бренд с таким названием уже существует." };
  }
  const newBrand: Brand = { ...brandData, id: generateId() };
  brands = [...brands, newBrand]; // Immutable update
  return JSON.parse(JSON.stringify(newBrand));
};

export const dbUpdateBrand = (id: string, brandData: Partial<Omit<Brand, 'id'>>): Brand | { error: string } | null => {
  noStore();
  const brandIndex = brands.findIndex(b => b.id === id);
  if (brandIndex === -1) return null;

  if (brandData.name && brands.some(b => b.name.toLowerCase() === brandData.name!.toLowerCase() && b.id !== id)) {
    return { error: "Бренд с таким названием уже существует." };
  }
  const updatedBrand = { ...brands[brandIndex], ...brandData };
  brands = brands.map(b => b.id === id ? updatedBrand : b); // Immutable update
  return JSON.parse(JSON.stringify(updatedBrand));
};

export const dbDeleteBrand = (id: string): { success: boolean, message?: string } => {
  noStore();
  const isUsed = products.some(p => p.brandId === id);
  if (isUsed) {
    return { success: false, message: "Нельзя удалить бренд, так как он используется в товарах." };
  }
  const initialLength = brands.length;
  brands = brands.filter(b => b.id !== id); // Immutable update
  return { success: brands.length < initialLength, message: brands.length < initialLength ? "Бренд успешно удален." : "Бренд не найден." };
};

export const dbAddSize = (sizeData: Omit<Size, 'id'>): Size | { error: string } => {
  noStore();
  const newId = sizeData.name.toLowerCase().replace(/\s+/g, '-');
  if (sizes.some(s => s.id === newId || s.name.toLowerCase() === sizeData.name.toLowerCase())) {
    return { error: "Размер с таким ID или названием уже существует." };
  }
  const newSize: Size = { id: newId, name: sizeData.name };
  sizes = [...sizes, newSize]; // Immutable update
  return JSON.parse(JSON.stringify(newSize));
};

export const dbUpdateSize = (id: string, sizeData: Partial<Omit<Size, 'id'>>): Size | { error: string } | null => {
  noStore();
  const sizeIndex = sizes.findIndex(s => s.id === id);
  if (sizeIndex === -1) return null;
  
  let updatedSizeData = { ...sizes[sizeIndex], ...sizeData };

  if (sizeData.name) {
    const newProposedId = sizeData.name.toLowerCase().replace(/\s+/g, '-');
    if (sizes.some(s => (s.id === newProposedId || s.name.toLowerCase() === sizeData.name!.toLowerCase()) && s.id !== id)) {
      return { error: "Размер с таким ID или названием уже существует." };
    }
    updatedSizeData.id = newProposedId; // Update id if name changes
  }
  
  sizes = sizes.map(s => s.id === id ? updatedSizeData : s); // Immutable update
  return JSON.parse(JSON.stringify(updatedSizeData));
};

export const dbDeleteSize = (id: string): { success: boolean, message?: string } => {
  noStore();
  const isUsed = products.some(p => p.sizes.includes(id));
  if (isUsed) {
    return { success: false, message: "Нельзя удалить размер, так как он используется в товарах." };
  }
  const initialLength = sizes.length;
  sizes = sizes.filter(s => s.id !== id); // Immutable update
  return { success: sizes.length < initialLength, message: sizes.length < initialLength ? "Размер успешно удален." : "Размер не найден." };
};

// Schemas for validation
export const storeSettingsSchema = z.object({
  isStoreClosed: z.boolean(),
  logoUrl: z.string().url({ message: "Неверный формат URL логотипа." }).nullable().or(z.literal('')),
});

export const productSchema = z.object({
  name: z.string().min(3, { message: "Название товара должно быть не менее 3 символов." }),
  description: z.string(),
  price: z.coerce.number().positive({ message: "Цена должна быть положительным числом." }),
  discount: z.coerce.number().min(0).max(100).optional().nullable(),
  brandName: z.string().min(1, { message: "Название бренда обязательно для указания." }),
  image: z.string().url({ message: "Неверный формат URL изображения." }).nullable().or(z.literal('')),
  sizes: z.array(z.string()).optional(),
});

export const brandSchema = z.object({
  name: z.string().min(2, { message: "Название бренда должно быть не менее 2 символов." }),
});

export const sizeSchema = z.object({
  name: z.string().min(1, { message: "Название размера обязательно." }),
});

