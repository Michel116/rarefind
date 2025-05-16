// src/lib/adminAuth.ts
'use client'; // For localStorage usage

// Default admin ID (e.g., your mock user ID for testing)
// In a real app, this list would be managed securely on a backend.
export const DEFAULT_ADMIN_IDS: number[] = [123456789]; // Corresponds to mockUser in TelegramContext

const ADMIN_IDS_STORAGE_KEY = 'appAdminUserIds';

export const getAdminIds = (): number[] => {
  if (typeof window !== 'undefined') {
    const storedAdminIds = localStorage.getItem(ADMIN_IDS_STORAGE_KEY);
    if (storedAdminIds) {
      try {
        const parsedIds = JSON.parse(storedAdminIds);
        if (Array.isArray(parsedIds) && parsedIds.every(id => typeof id === 'number')) {
          return parsedIds;
        }
      } catch (e) {
        console.error("Ошибка при чтении ID администраторов из localStorage", e);
      }
    }
    // If no valid data in localStorage, set and return default
    localStorage.setItem(ADMIN_IDS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_IDS));
    return [...DEFAULT_ADMIN_IDS];
  }
  // Fallback for SSR or environments without window
  return [...DEFAULT_ADMIN_IDS];
};

export const setAdminIds = (adminIds: number[]): void => {
  if (typeof window !== 'undefined') {
    const uniqueValidIds = Array.from(new Set(adminIds.filter(id => typeof id === 'number')));
    localStorage.setItem(ADMIN_IDS_STORAGE_KEY, JSON.stringify(uniqueValidIds));
  }
};

export const addAdminId = (adminId: number): boolean => {
  if (typeof window !== 'undefined' && typeof adminId === 'number') {
    const currentAdminIds = getAdminIds();
    if (!currentAdminIds.includes(adminId)) {
      const updatedAdminIds = [...currentAdminIds, adminId];
      setAdminIds(updatedAdminIds);
      return true;
    }
  }
  return false;
};

export const removeAdminId = (adminIdToRemove: number): boolean => {
  if (typeof window !== 'undefined') {
    const currentAdminIds = getAdminIds();
    if (currentAdminIds.includes(adminIdToRemove)) {
      // Prevent removing the last admin
      if (currentAdminIds.length === 1 && currentAdminIds[0] === adminIdToRemove) {
        console.warn("Попытка удалить последнего администратора.");
        return false;
      }
      const updatedAdminIds = currentAdminIds.filter(id => id !== adminIdToRemove);
      setAdminIds(updatedAdminIds);
      return true;
    }
  }
  return false;
};

// Helper function to check if a user is an admin.
export const isUserAdmin = (userId: number | undefined): boolean => {
  if (typeof window === 'undefined' || userId === undefined) {
    return false; 
  }
  const adminIds = getAdminIds();
  return adminIds.includes(userId);
};
