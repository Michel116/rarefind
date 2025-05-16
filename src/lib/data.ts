import type { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Современная футболка с принтом', // Modern Graphic Tee
    brand: 'UrbanWear',
    size: ['S', 'M', 'L', 'XL'],
    price: 2999.00, // Example price in Rubles
    imageUrl: 'https://placehold.co/400x500/3F51B5/FFFFFF.png?text=Футболка',
    dataAiHint: 'graphic tee',
    description: 'Удобная хлопковая футболка с ярким графическим принтом.',
    availableSizes: ['S', 'M', 'L'],
  },
  {
    id: '2',
    name: 'Чиносы слим-фит', // Slim Fit Chinos
    brand: 'ClassicStyle',
    size: ['30', '32', '34', '36'],
    price: 5999.00,
    imageUrl: 'https://placehold.co/400x500/FF7043/FFFFFF.png?text=Чиносы',
    dataAiHint: 'slim chinos',
    description: 'Универсальные чиносы слим-фит для любого случая.',
    availableSizes: ['30', '32', '34'],
  },
  {
    id: '3',
    name: 'Винтажная джинсовая куртка', // Vintage Denim Jacket
    brand: 'RetroFinds',
    size: ['M', 'L', 'XL'],
    price: 8999.00,
    imageUrl: 'https://placehold.co/400x500/4CAF50/FFFFFF.png?text=Куртка',
    dataAiHint: 'denim jacket',
    description: 'Нестареющая джинсовая куртка с винтажной стиркой.',
    availableSizes: ['M', 'L', 'XL'],
  },
  {
    id: '4',
    name: 'Роскошный шелковый шарф', // Luxury Silk Scarf
    brand: 'EleganceCo',
    size: ['Единый размер'], // One Size
    price: 4500.00,
    imageUrl: 'https://placehold.co/400x500/E91E63/FFFFFF.png?text=Шарф',
    dataAiHint: 'silk scarf',
    description: 'Элегантный шелковый шарф с уникальным узором.',
    availableSizes: ['Единый размер'],
  },
  {
    id: '5',
    name: 'Спортивные кроссовки Performance', // Sport Performance Sneakers
    brand: 'ActiveGear',
    size: ['8', '9', '10', '11'], // Assuming these are US sizes, keep as is or map to RU if needed
    price: 12000.00,
    imageUrl: 'https://placehold.co/400x500/9C27B0/FFFFFF.png?text=Кроссовки',
    dataAiHint: 'sport sneakers',
    description: 'Высокопроизводительные кроссовки для вашего активного образа жизни.',
    availableSizes: ['9', '10', '11'],
  },
  {
    id: '6',
    name: 'Минималистичное худи', // Minimalist Hoodie
    brand: 'UrbanWear',
    size: ['S', 'M', 'L'],
    price: 6500.00,
    imageUrl: 'https://placehold.co/400x500/795548/FFFFFF.png?text=Худи',
    dataAiHint: 'minimalist hoodie',
    description: 'Стильное и удобное минималистичное худи.',
    availableSizes: ['S', 'M'],
  },
];

export const availableBrands: string[] = [
  'Все бренды', // All Brands
  ...new Set(mockProducts.map(p => p.brand))
];

const FILTERABLE_SIZES_STORAGE_KEY = 'appFilterableSizes';

// Default sizes if nothing in localStorage or if parsing fails
const DEFAULT_FILTERABLE_SIZES: string[] = ['Все размеры', 'S', 'M', 'L', 'XL', 'XS', 'XXL'];

export const getGlobalFilterableSizes = (): string[] => {
  if (typeof window !== 'undefined') {
    const storedSizes = localStorage.getItem(FILTERABLE_SIZES_STORAGE_KEY);
    if (storedSizes) {
      try {
        const parsedSizes = JSON.parse(storedSizes);
        // Basic validation: ensure it's an array and "Все размеры" is present and first.
        if (Array.isArray(parsedSizes) && parsedSizes.length > 0 && parsedSizes[0] === 'Все размеры') {
          // Ensure all items are strings
          if (parsedSizes.every(item => typeof item === 'string')) {
            return parsedSizes;
          }
        }
      } catch (e) {
        console.error("Ошибка при чтении размеров для фильтра из localStorage", e);
        // Fallback to default if parsing fails or data is invalid
      }
    }
    // If no valid data in localStorage, set and return default
    localStorage.setItem(FILTERABLE_SIZES_STORAGE_KEY, JSON.stringify(DEFAULT_FILTERABLE_SIZES));
    return [...DEFAULT_FILTERABLE_SIZES];
  }
  // Fallback for SSR or environments without window
  return [...DEFAULT_FILTERABLE_SIZES];
};

export const setGlobalFilterableSizes = (sizes: string[]): void => {
  if (typeof window !== 'undefined') {
    // Ensure "Все размеры" is always the first element and all entries are unique strings.
    const uniqueValidSizes = Array.from(new Set(sizes.map(s => String(s).trim()).filter(s => s !== '' && s !== 'Все размеры')));
    const newSizes = ['Все размеры', ...uniqueValidSizes];
    localStorage.setItem(FILTERABLE_SIZES_STORAGE_KEY, JSON.stringify(newSizes));
  }
};

// The old `availableSizes` which was computed is no longer needed here
// as ProductFilters will use getGlobalFilterableSizes.
// Ensure no component is relying on an `availableSizes` export that was previously here.
// We've removed this:
// const allProductSizes = new Set(mockProducts.flatMap(p => p.size));
// const filteredSizes = Array.from(allProductSizes).filter(size => {
//   const isNumeric = /^\d+$/.test(size);
//   const isOneSize = size === 'Единый размер';
//   return !isNumeric && !isOneSize;
// });
// export const availableSizes: string[] = [
//   'Все размеры',
//   ...new Set(filteredSizes)
// ];
