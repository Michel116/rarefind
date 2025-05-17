
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Trash2, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { SiteConfigData } from '@/config/site';
import { useToast } from '@/hooks/use-toast';
import { createMockOrder } from '@/lib/data'; // Импортируем функцию создания заказа

// В реальном приложении ID пользователя будет браться из сессии аутентификации
const MOCK_USER_ID = 'user123'; 

export function CartSheet() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getItemCount, 
    getCartTotal,
    isCartOpen,
    setIsCartOpen,
    clearCart
  } = useCart();
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Пожалуйста, добавьте товары в корзину перед оформлением.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Имитируем создание заказа
      await createMockOrder(MOCK_USER_ID, cartItems);
      
      toast({
        title: "Заказ оформлен",
        description: "Ваш заказ успешно оформлен и ожидает подтверждения.",
      });
      clearCart(); // Очищаем корзину после "успешного" оформления
      setIsCartOpen(false); // Закрываем корзину
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      toast({
        title: "Ошибка оформления",
        description: "Не удалось оформить заказ. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="text-2xl">Корзина</SheetTitle>
          <SheetDescription>
            У вас {getItemCount()} товар(а) на сумму {getCartTotal().toLocaleString('ru-RU')} {SiteConfigData.currency}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">Ваша корзина пуста</p>
            <p className="text-muted-foreground mb-4">Добавьте товары, чтобы увидеть их здесь.</p>
            <SheetClose asChild>
              <Button asChild variant="outline">
                <Link href="/">Продолжить покупки</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow p-6 pr-3">
              <div className="space-y-4">
                {cartItems.map(item => {
                  const discountedPrice = item.product.discount
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price;
                  return (
                    <div key={item.product.id} className="flex items-center gap-4 p-2 border rounded-md shadow-sm bg-card">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={100}
                        className="rounded-md object-cover aspect-[4/5]"
                        data-ai-hint="product fashion"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-sm truncate" title={item.product.name}>{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(discountedPrice).toLocaleString('ru-RU')} {SiteConfigData.currency} / шт.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                                const newQuantity = parseInt(e.target.value, 10);
                                if (!isNaN(newQuantity) && newQuantity > 0) {
                                    updateQuantity(item.product.id, newQuantity);
                                } else if (e.target.value === "" || newQuantity <= 0) {
                                    updateQuantity(item.product.id, 0);
                                }
                            }}
                            className="h-7 w-12 text-center px-1"
                            min="1"
                          />
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {(Math.round(discountedPrice) * item.quantity).toLocaleString('ru-RU')} {SiteConfigData.currency}
                        </p>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-7 w-7 mt-1" onClick={() => removeFromCart(item.product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6 flex-col sm:flex-col space-y-4">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Итого:</span>
                <span>{getCartTotal().toLocaleString('ru-RU')} {SiteConfigData.currency}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg">
                Перейти к оформлению
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                   <X className="mr-2 h-4 w-4" /> Закрыть
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

