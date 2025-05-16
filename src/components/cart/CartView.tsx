"use client";

import { useCart } from '@/contexts/CartContext';
import { CartItemCard } from './CartItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


export function CartView() {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const { webApp, user } = useTelegram();
  const { toast } = useToast();
  const totalAmount = getCartTotal();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    if (webApp && user) {
      const orderData = {
        userId: user.id,
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity, size: item.selectedSize, price: item.price })),
        total: totalAmount,
      };
      
      toast({
        title: "Оформление заказа начато",
        description: "Переходим к оформлению... (Это демо)",
      });

      webApp.MainButton.setText(`Оплатить ${totalAmount.toFixed(2)} ₽`);
      webApp.MainButton.show();
      webApp.MainButton.onClick(() => {
        webApp.HapticFeedback.notificationOccurred('success');
        toast({
          title: "Оплата прошла успешно (Демо)",
          description: "Ваш заказ оформлен!",
        });
        clearCart();
        webApp.MainButton.hide();
      });

    } else {
      toast({
        title: "Оформление заказа недоступно",
        description: "Функции Telegram недоступны. Невозможно продолжить оформление заказа.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (webApp?.MainButton.isVisible) {
        webApp.MainButton.offClick(() => {}); 
        webApp.MainButton.hide();
      }
    };
  }, [webApp]);


  if (itemCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ShoppingCart className="h-20 w-20 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Ваша корзина пуста</h2>
        <p className="text-muted-foreground mb-6">Похоже, вы еще ничего не добавили в корзину.</p>
        <Button asChild>
          <Link href="/">Начать покупки</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <ScrollArea className="md:col-span-2 h-[calc(100vh-18rem)] pr-4">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItemCard key={`${item.id}-${item.selectedSize}`} item={item} />
          ))}
        </div>
      </ScrollArea>

      <div className="md:col-span-1">
        <Card className="sticky top-24 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl">Сводка по заказу</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Подытог ({itemCount} {itemCount === 1 ? 'товар' : itemCount > 1 && itemCount < 5 ? 'товара' : 'товаров'})</span>
              <span>{totalAmount.toFixed(2)} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Доставка</span>
              <span>БЕСПЛАТНО</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Итого</span>
              <span>{totalAmount.toFixed(2)} ₽</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleCheckout} className="w-full" size="lg" disabled={!webApp}>
              <CreditCard className="mr-2 h-5 w-5" />
              Перейти к оплате
            </Button>
            <Button variant="outline" onClick={clearCart} className="w-full">
              Очистить корзину
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
