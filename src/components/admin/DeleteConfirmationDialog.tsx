
"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationDialogProps {
  itemName: string;
  onConfirm: () => Promise<{ message: string; success: boolean } | void>;
  children: React.ReactNode;
  variant?: "default" | "destructive";
}

export function DeleteConfirmationDialog({
  itemName,
  onConfirm,
  children,
  variant = "destructive",
}: DeleteConfirmationDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      const result = await onConfirm();
      if (result && typeof result === 'object' && 'message' in result) {
        if (result.success) {
          toast({ title: "Успех", description: result.message });
        } else {
          toast({ title: "Ошибка", description: result.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Успех", description: `Элемент "${itemName}" успешно удален.` });
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Deletion error:", error);
      const errorMessage = error instanceof Error ? error.message : `Не удалось удалить "${itemName}".`;
      toast({
        title: "Ошибка удаления",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Вы действительно хотите удалить 
            <span className="font-semibold"> "{itemName}"</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className={variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {isPending ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
