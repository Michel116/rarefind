
"use client";

import type { Order, OrderStatus } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from 'next/image';
import { ClipboardList, Package, Truck, CheckCircle, XCircle, CircleDollarSign, Cog, Clock } from "lucide-react"; // Добавлена иконка Clock
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface OrderHistoryTableProps {
  orders: Order[];
  currency: string;
}

const getStatusInfo = (status: OrderStatus): { text: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" } => {
  switch (status) {
    case 'pending_payment':
      return { text: "Ожидает оплаты", icon: CircleDollarSign, variant: "outline" };
    case 'awaiting_confirmation': // Новый статус
      return { text: "Ожидает подтверждения", icon: Clock, variant: "outline" };
    case 'processing':
      return { text: "В обработке", icon: Cog, variant: "secondary" };
    case 'awaiting_shipment':
      return { text: "Ожидает отправки", icon: Package, variant: "secondary" };
    case 'shipped':
      return { text: "Отправлен", icon: Truck, variant: "default" };
    case 'in_transit':
      return { text: "В пути", icon: Truck, variant: "default" };
    case 'delivered':
      return { text: "Доставлен", icon: CheckCircle, variant: "default" };
    case 'cancelled':
      return { text: "Отменен", icon: XCircle, variant: "destructive" };
    default:
      return { text: status, icon: Package, variant: "outline" };
  }
};

export function OrderHistoryTable({ orders, currency }: OrderHistoryTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">№ Заказа</TableHead>
            <TableHead className="w-[150px]">Дата</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                История заказов пуста.
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{format(new Date(order.orderDate), "dd MMMM yyyy, HH:mm", { locale: ru })}</TableCell>
                <TableCell>{order.totalAmount.toLocaleString('ru-RU')} {currency}</TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant} className="whitespace-nowrap">
                    <statusInfo.icon className="mr-1.5 h-3.5 w-3.5" />
                    {statusInfo.text}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Подробнее
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Заказ №{order.orderNumber}</DialogTitle>
                        <DialogDescription>
                          Дата: {format(new Date(order.orderDate), "dd MMMM yyyy, HH:mm", { locale: ru })} | Статус: {statusInfo.text}
                          {order.trackingNumber && ` | Трек-номер: ${order.trackingNumber}`}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        {order.items.map(item => (
                          <div key={item.productId} className="flex items-start gap-4 p-3 border rounded-md">
                            <Image 
                              src={item.image || "https://placehold.co/80x100.png"} 
                              alt={item.productName} 
                              width={80} 
                              height={100} 
                              className="rounded object-cover aspect-[4/5]"
                              data-ai-hint="product item"
                            />
                            <div className="flex-grow">
                              <p className="font-semibold">{item.productName}</p>
                              <p className="text-sm text-muted-foreground">Количество: {item.quantity}</p>
                              <p className="text-sm text-muted-foreground">Цена за шт.: {item.pricePerItem.toLocaleString('ru-RU')} {currency}</p>
                            </div>
                            <p className="font-semibold whitespace-nowrap">{(item.quantity * item.pricePerItem).toLocaleString('ru-RU')} {currency}</p>
                          </div>
                        ))}
                         <div className="text-right font-bold text-lg pt-2 border-t">
                            Итого: {order.totalAmount.toLocaleString('ru-RU')} {currency}
                          </div>
                        {order.shippingAddress && (
                          <div className="text-sm">
                            <p className="font-medium">Адрес доставки:</p>
                            <p className="text-muted-foreground">{order.shippingAddress}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

