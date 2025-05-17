
"use client";

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateStoreSettings } from '@/lib/actions';
import type { StoreSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface StoreManagementFormProps {
  settings: StoreSettings;
}

const initialState: { message: string | null; errors: any | null; success: boolean | null } = {
  message: null,
  errors: null,
  success: null,
};

export function StoreManagementForm({ settings }: StoreManagementFormProps) {
  const [state, formAction, isPending] = useActionState(updateStoreSettings, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      if (state.errors || !state.success) {
        toast({
          title: "Ошибка обновления",
          description: state.message,
          variant: "destructive",
        });
      } else if (state.success) {
        toast({
          title: "Успех",
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <form action={formAction} key={JSON.stringify(settings)}> {/* Add key here */}
      <Card>
        <CardHeader>
          <CardTitle>Настройки магазина</CardTitle>
          <CardDescription>
            Управляйте основными настройками вашего интернет-магазина.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="isStoreClosed"
              name="isStoreClosed"
              defaultChecked={settings.isStoreClosed}
              aria-label="Магазин закрыт на техническое обслуживание"
            />
            <Label htmlFor="isStoreClosed" className="cursor-pointer">
              Магазин закрыт на техническое обслуживание
            </Label>
          </div>
          {state?.errors?.isStoreClosed && <p className="text-sm text-destructive">{state.errors.isStoreClosed[0]}</p>}
          
          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL логотипа</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="url"
              defaultValue={settings.logoUrl || ''}
              placeholder="https://example.com/logo.png"
            />
            {state?.errors?.logoUrl && <p className="text-sm text-destructive">{state.errors.logoUrl[0]}</p>}
            <p className="text-xs text-muted-foreground">
              Если оставить пустым, будет использовано текстовое лого.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" /> {isPending ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
