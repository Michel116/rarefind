
"use client";

import { useState, useEffect, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Brand, Size } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Save } from 'lucide-react';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { addBrand, updateBrand, deleteBrand, addSize, updateSize, deleteSize } from '@/lib/actions';

type Item = Brand | Size;

interface FilterManagementTableProps<T extends Item> {
  items: T[];
  itemType: 'brand' | 'size';
  columns: { accessorKey: keyof T; header: string }[];
  dialogTitle: string;
  dialogFields: { name: keyof T; label: string; type: string; placeholder?: string }[];
}

const initialState: { message: string | null; errors: any | null; success: boolean | null } = {
  message: null,
  errors: null,
  success: null,
};

export function FilterManagementTable<T extends Item>({
  items,
  itemType,
  columns,
  dialogTitle,
  dialogFields,
}: FilterManagementTableProps<T>) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formKey, setFormKey] = useState(Date.now()); 

  const addAction = itemType === 'brand' ? addBrand : addSize;
  const updateActionFn = itemType === 'brand' ? updateBrand : updateSize;
  const deleteActionFn = itemType === 'brand' ? deleteBrand : deleteSize;
  
  const currentAction = editingItem 
    ? updateActionFn.bind(null, editingItem.id) 
    : addAction;

  const [state, formAction, isPending] = useActionState(currentAction, initialState);

  useEffect(() => {
    if (!isDialogOpen) {
      setEditingItem(null);
      setFormKey(Date.now()); 
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (state?.message) {
      if (state.errors || !state.success) {
        toast({
          title: `Ошибка ${editingItem ? 'обновления' : 'добавления'}`,
          description: state.message,
          variant: "destructive",
        });
      } else if (state.success) {
        toast({
          title: "Успех!",
          description: state.message,
        });
        setIsDialogOpen(false);
      }
    }
  }, [state, toast, editingItem]);

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setFormKey(Date.now()); 
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormKey(Date.now()); 
    setIsDialogOpen(true);
  };
  
  const getFieldValue = (item: T | null, fieldName: keyof T) => {
    if (!item) return '';
    const value = item[fieldName];
    return typeof value === 'string' || typeof value === 'number' ? value : '';
  };

  return (
    <div className="border rounded-lg">
      <div className="p-4 flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Добавить {dialogTitle}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Редактировать' : 'Добавить'} {dialogTitle}</DialogTitle>
              <DialogDescription>
                {editingItem ? `Обновите информацию о ${dialogTitle}.` : `Введите информацию для нового ${dialogTitle}.`}
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} key={formKey}> 
              <div className="grid gap-4 py-4">
                {dialogFields.map(field => (
                  <div className="grid grid-cols-4 items-center gap-4" key={String(field.name)}>
                    <Label htmlFor={String(field.name)} className="text-right">
                      {field.label}
                    </Label>
                    <Input
                      id={String(field.name)}
                      name={String(field.name)}
                      type={field.type}
                      defaultValue={editingItem ? getFieldValue(editingItem, field.name) : ''}
                      placeholder={field.placeholder}
                      className="col-span-3"
                      required
                    />
                  </div>
                ))}
                {state?.errors && Object.entries(state.errors).map(([key, value]) => (
                    value && (value as string[]).map((errorMsg: string, index: number) => (
                        <p key={`${key}-${index}`} className="col-span-4 text-sm text-destructive text-center">{errorMsg}</p>
                    ))
                ))}
                {state?.message && !state.success && !state.errors && (
                  <p className="col-span-4 text-sm text-destructive text-center">{state.message}</p>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Отмена</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  <Save className="mr-2 h-4 w-4" /> {isPending ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={String(col.accessorKey)}>{col.header}</TableHead>
            ))}
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {columns.map(col => (
                <TableCell key={String(col.accessorKey)}>
                  {String(item[col.accessorKey] === undefined || item[col.accessorKey] === null ? '' : item[col.accessorKey])}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} aria-label="Редактировать">
                  <Edit className="h-4 w-4" />
                </Button>
                <DeleteConfirmationDialog
                  itemName={String(item.name)}
                  onConfirm={deleteActionFn.bind(null, item.id)}
                >
                  <Button variant="ghost" size="icon" aria-label="Удалить" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DeleteConfirmationDialog>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
             <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  {itemType === 'brand' ? 'Бренды не найдены.' : 'Размеры не найдены.'}
                </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
