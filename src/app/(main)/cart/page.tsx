import { CartView } from '@/components/cart/CartView';

export default function CartPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Ваша Корзина</h1>
      <CartView />
    </div>
  );
}
