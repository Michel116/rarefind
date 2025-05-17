
"use server";

import { revalidatePath } from 'next/cache';
import {
  storeSettingsSchema,
  productSchema,
  brandSchema,
  sizeSchema,
  dbUpdateStoreSettings,
  dbAddProduct,
  dbUpdateProduct,
  dbDeleteProduct,
  dbAddBrand,
  dbUpdateBrand,
  dbDeleteBrand,
  dbAddSize,
  dbUpdateSize,
  dbDeleteSize,
  getOrCreateBrandByName,
} from './data';
import type { Product, Brand, Size } from './types'; // Removed Omit as it's not directly used for action params
import type { z } from 'zod';

// Helper function to extract validation errors
const getValidationErrors = (fieldErrors: Record<string, string[] | undefined>) => {
  return Object.entries(fieldErrors)
    .filter((entry): entry is [string, string[]] => {
      const [, messages] = entry;
      return Array.isArray(messages) && messages.length > 0;
    })
    .map(([key, messages]) =>
      `${key}: ${messages.join(', ')}`
    ).join('; ');
};

// Store Settings Actions
export async function updateStoreSettings(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = storeSettingsSchema.safeParse({
    isStoreClosed: rawData.isStoreClosed === 'on',
    logoUrl: rawData.logoUrl || null,
  });

  if (!validatedFields.success) {
    return {
      message: `Ошибка валидации: ${getValidationErrors(validatedFields.error.flatten().fieldErrors)}`,
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    dbUpdateStoreSettings(validatedFields.data);
    revalidatePath('/admin');
    revalidatePath('/');
    return { message: "Настройки магазина успешно обновлены.", success: true, errors: null };
  } catch (error) {
    console.error("Error updating store settings:", error);
    return { message: "Не удалось обновить настройки магазина. Пожалуйста, проверьте консоль сервера.", success: false, errors: null };
  }
}

// Product Actions
export async function addProduct(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const sizesArray = formData.getAll('sizes') as string[];

  const validatedFields = productSchema.safeParse({
    name: rawData.name,
    description: rawData.description,
    price: parseFloat(rawData.price as string),
    discount: rawData.discount && rawData.discount !== '' ? parseInt(rawData.discount as string, 10) : undefined,
    brandName: rawData.brandName,
    image: rawData.image || null,
    sizes: sizesArray,
  });

  if (!validatedFields.success) {
    return {
      message: `Ошибка валидации: ${getValidationErrors(validatedFields.error.flatten().fieldErrors)}`,
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const brand = getOrCreateBrandByName(validatedFields.data.brandName as string);
    const productDataForDb = {
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      price: validatedFields.data.price,
      discount: validatedFields.data.discount,
      brandId: brand.id, // Use the id from the resolved brand
      image: validatedFields.data.image || null,
      sizes: validatedFields.data.sizes || [],
    };

    dbAddProduct(productDataForDb);
    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/admin/filters'); // In case a new brand was created
    return { message: "Товар успешно добавлен.", success: true, errors: null };
  } catch (error) {
    console.error("Error adding product:", error);
    return { message: "Не удалось добавить товар. Пожалуйста, проверьте консоль сервера.", success: false, errors: null };
  }
}

export async function updateProduct(id: string, prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const sizesArray = formData.getAll('sizes') as string[];

  const validatedFields = productSchema.safeParse({
    name: rawData.name,
    description: rawData.description,
    price: parseFloat(rawData.price as string),
    discount: rawData.discount && rawData.discount !== '' ? parseInt(rawData.discount as string, 10) : undefined,
    brandName: rawData.brandName,
    image: rawData.image || null,
    sizes: sizesArray,
  });

  if (!validatedFields.success) {
    return {
      message: `Ошибка валидации: ${getValidationErrors(validatedFields.error.flatten().fieldErrors)}`,
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const brand = getOrCreateBrandByName(validatedFields.data.brandName as string);
    const productDataForDb = {
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      price: validatedFields.data.price,
      discount: validatedFields.data.discount,
      brandId: brand.id, // Use the id from the resolved brand
      image: validatedFields.data.image || null,
      sizes: validatedFields.data.sizes || [],
    };

    const updatedProduct = dbUpdateProduct(id, productDataForDb);
    if (!updatedProduct) {
      return { message: "Товар для обновления не найден.", success: false, errors: null };
    }
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/edit/${id}`);
    revalidatePath('/');
    revalidatePath('/admin/filters'); // In case a new brand was created
    return { message: "Товар успешно обновлен.", success: true, errors: null };
  } catch (error) {
    console.error("Error updating product:", error);
    return { message: "Не удалось обновить товар. Пожалуйста, проверьте консоль сервера.", success: false, errors: null };
  }
}

export async function deleteProduct(id: string) {
  try {
    const success = dbDeleteProduct(id);
    if (!success) {
      return { message: "Товар для удаления не найден или уже был удален.", success: false };
    }
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { message: "Товар успешно удален.", success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { message: "Ошибка при удалении товара. Пожалуйста, проверьте консоль сервера.", success: false };
  }
}

// Brand Actions
export async function addBrand(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = brandSchema.safeParse({ name: rawData.name as string });

  if (!validatedFields.success) {
    return {
      message: `Ошибка валидации: ${getValidationErrors(validatedFields.error.flatten().fieldErrors)}`,
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  try {
    const result = dbAddBrand(validatedFields.data);
    if (result && 'error' in result && result.error) {
        return { message: result.error, success: false, errors: {name: [result.error]} };
    }
    revalidatePath('/admin/filters');
    revalidatePath('/admin/products/new'); // Revalidate product form in case brand list needs update
    revalidatePath('/admin/products/edit/*'); // Revalidate all edit product forms
    return { message: "Бренд успешно добавлен.", success: true, errors: null };
  } catch (error) {
    console.error("Error adding brand:", error);
    return { message: "Не удалось добавить бренд. Пожалуйста, проверьте консоль сервера.", success: false, errors: null };
  }
}

export async function updateBrand(id: string, prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = brandSchema.safeParse({ name: rawData.name as string });

  if (!validatedFields.success) {
     return {
      message: `Ошибка валидации: ${getValidationErrors(validatedFields.error.flatten().fieldErrors)}`,
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  try {
    const result = dbUpdateBrand(id, validatedFields.data);
    if (!result) {
      return { message: "Бренд для обновления не найден.", success: false, errors: null };
    }
    if (result && 'error' in result && result.error) {
        return { message: result.error, success: false, errors: {name: [result.error]} };
    }
    revalidatePath('/admin/filters');
    revalidatePath('/admin/products'); // Products might display brand names
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/edit/*');
    return { message: "Бренд успешно обновлен.", success: true, errors: null };
  } catch (error) {
    console.error("Error updating brand:", error);
    return { message: "Не удалось обновить бренд. Пожалуйста, проверьте консоль сервера.", success: false, errors: null };
  }
}

export async function deleteBrand(id: string) {
  try {
    const result = dbDeleteBrand(id);
    if (!result.success) {
      return { message: result.message || "Не удалось удалить бренд.", success: false };
    }
    revalidatePath('/admin/filters');
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/edit/*');
    return { message: result.message || "Бренд успешно удален.", success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return { message: "Ошибка при удалении бренда. Пожалуйста, проверьте консоль сервера.", success: false };
  }
}

// Size Actions
export async function addSize(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = sizeSchema.safeParse({ name: rawData.name as string });

  if (!validatedFields.success) {
    return {
      message: `Ошибка валидации: ${getValidationErrors(validatedFields.error.flatten().fieldErrors)}`,
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  try {
    const result = dbAddSize(validatedFields.data);
    if (result && 'error' in result && result.error) {
        return { message: result.error, success: false, errors: {name: [result.error]} };
    }
    revalidatePath('/admin/filters');
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/edit/*');
    return { message: "Размер успешно добавлен.", success: true, errors: null };
  } catch (error) {
    console.error("Error adding size:", error);
    return { message: "Не удалось добавить размер. Пожалуйста, проверьте консоль сервера.", success: false, errors: null };
  }
}

export async function updateSize(id: string, prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = sizeSchema.safeParse({ name: rawData.name as string });

  if (!validatedFields.success) {
    return {
      message: `Ошибка валидации: ${getValidationErrors(validatedFields.error.flatten().fieldErrors)}`,
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  try {
    const result = dbUpdateSize(id, validatedFields.data);
     if (!result) {
      return { message: "Размер для обновления не найден.", success: false, errors: null };
    }
    if (result && 'error' in result && result.error) {
        return { message: result.error, success: false, errors: {name: [result.error]} };
    }
    revalidatePath('/admin/filters');
    revalidatePath('/admin/products'); // Products display sizes
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/edit/*');
    return { message: "Размер успешно обновлен.", success: true, errors: null };
  } catch (error) {
    console.error("Error updating size:", error);
    return { message: "Не удалось обновить размер. Пожалуйста, проверьте консоль сервера.", success: false, errors: null };
  }
}

export async function deleteSize(id: string) {
  try {
    const result = dbDeleteSize(id);
    if (!result.success) {
      return { message: result.message || "Не удалось удалить размер.", success: false };
    }
    revalidatePath('/admin/filters');
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/edit/*');
    return { message: result.message || "Размер успешно удален.", success: true };
  } catch (error) {
    console.error("Error deleting size:", error);
    return { message: "Ошибка при удалении размера. Пожалуйста, проверьте консоль сервера.", success: false };
  }
}

