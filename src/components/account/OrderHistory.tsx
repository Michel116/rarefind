"use client";

import { useState, useEffect } from 'react';
import type { Order, CartItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, CalendarDays, ListOrdered, AlertCircle } from 'lucide-react';
import Image from 'next/image';

// Mock order data
const mockOrders: Order[] = [
  {
    id: 'ORDER-001',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    items: [
      { id: '1', name: 'Modern Graphic Tee', brand: 'UrbanWear', size: ['M'], price: 29.99, imageUrl: 'https://placehold.co/60x80/3F51B5/FFFFFF.png?text=Tee', description: '', availableSizes: ['M'], quantity: 1, selectedSize: 'M', dataAiHint: 'graphic tee' },
      { id: '2', name: 'Slim Fit Chinos', brand: 'ClassicStyle', size: ['32'], price: 59.99, imageUrl: 'https://placehold.co/60x80/FF7043/FFFFFF.png?text=Chinos', description: '', availableSizes: ['32'], quantity: 1, selectedSize: '32', dataAiHint: 'slim chinos' },
    ],
    totalAmount: 89.98,
    status: 'Delivered',
  },
  {
    id: 'ORDER-002',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    items: [
      { id: '3', name: 'Vintage Denim Jacket', brand: 'RetroFinds', size: ['L'], price: 89.99, imageUrl: 'https://placehold.co/60x80/4CAF50/FFFFFF.png?text=Jacket', description: '', availableSizes: ['L'], quantity: 1, selectedSize: 'L', dataAiHint: 'denim jacket' },
    ],
    totalAmount: 89.99,
    status: 'Shipped',
  },
    {
    id: 'ORDER-003',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    items: [
      { id: '5', name: 'Sport Performance Sneakers', brand: 'ActiveGear', size: ['10'], price: 120.00, imageUrl: 'https://placehold.co/60x80/9C27B0/FFFFFF.png?text=Sneakers', description: '', availableSizes: ['10'], quantity: 2, selectedSize: '10', dataAiHint: 'sport sneakers' },
    ],
    totalAmount: 240.00,
    status: 'Pending',
  },
];


export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching order data
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  const translateStatus = (status: Order['status']): string => {
    switch (status) {
      case 'Delivered': return 'Доставлен';
      case 'Shipped': return 'Отправлен';
      case 'Pending': return 'В ожидании';
      case 'Cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg rounded-lg mt-8">
        <CardHeader>
          <CardTitle className="text-xl">История Заказов</CardTitle>
          <CardDescription>Загрузка ваших прошлых заказов...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="p-4 border rounded-md animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg mt-8">
        <CardHeader>
          <CardTitle className="text-xl">История Заказов</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <ListOrdered className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">У вас нет прошлых заказов.</p>
          <p className="text-sm text-muted-foreground">Начните делать покупки, чтобы увидеть свои заказы здесь!</p>
        </CardContent>
      </Card>
    );
  }
  
  const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Delivered': return 'default'; // Using primary for success
      case 'Shipped': return 'secondary';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <Card className="shadow-lg rounded-lg mt-8">
      <CardHeader>
        <CardTitle className="text-xl">История Заказов</CardTitle>
        <CardDescription>Просмотрите ваши прошлые покупки и их статусы.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-3"> {/* Adjust height as needed */}
          <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => (
              <AccordionItem value={order.id} key={order.id} className="mb-3 border rounded-md shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 rounded-t-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-left">
                    <div className="mb-2 sm:mb-0">
                      <span className="font-semibold text-md">ID Заказа: {order.id}</span>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                       <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs px-2 py-0.5">{translateStatus(order.status)}</Badge>
                       <span className="text-md font-semibold text-primary">{order.totalAmount.toFixed(2)} ₽</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 border-t">
                  <h4 className="font-medium mb-2 text-sm">Товары:</h4>
                  <ul className="space-y-3">
                    {order.items.map((item: CartItem, index: number) => (
                      <li key={`${item.id}-${index}`} className="flex items-center gap-3 p-2 bg-background rounded-md border">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={40}
                          height={50}
                          className="rounded object-cover"
                          data-ai-hint={item.dataAiHint}
                        />
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.brand} - Размер: {item.selectedSize} - Кол-во: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">{(item.price * item.quantity).toFixed(2)} ₽</p>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
