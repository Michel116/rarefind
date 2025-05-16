"use client";

import type { User } from '@/lib/types';
import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the structure of the Telegram WebApp object
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
      photo_url?: string;
    };
    auth_date: string;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (disable?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  // Add other properties and methods as needed
}

interface TelegramContextType {
  webApp?: TelegramWebApp;
  user?: User;
  isInitializing: boolean;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

// Mock Telegram WebApp for development outside Telegram
const mockWebApp: TelegramWebApp = {
  initData: '',
  initDataUnsafe: {
    user: {
      id: 123456789,
      first_name: 'Разработчик', // Dev
      last_name: 'Пользователь', // User
      username: 'devuser_ru',
      language_code: 'ru',
      is_premium: true,
      photo_url: 'https://placehold.co/100x100/3F51B5/FFFFFF.png?text=РП' // РП for Разработчик Пользователь
    },
    auth_date: new Date().toISOString(),
    hash: 'mock_hash_string_for_development_only_1234567890abcdef',
  },
  version: '6.9',
  platform: 'tdesktop', // or 'ios', 'android'
  colorScheme: 'light',
  themeParams: {
    bg_color: '#F5F5F5', 
    text_color: '#212121',
    hint_color: '#9E9E9E', 
    link_color: '#3F51B5', 
    button_color: '#3F51B5',
    button_text_color: '#FFFFFF', 
    secondary_bg_color: '#E0E0E0', 
  },
  isExpanded: true,
  viewportHeight: 800,
  viewportStableHeight: 750,
  MainButton: {
    text: 'ПРОДОЛЖИТЬ', // CONTINUE
    color: '#3F51B5',
    textColor: '#FFFFFF',
    isVisible: false,
    isActive: true,
    isProgressVisible: false,
    setText: (text: string) => console.log('MainButton.setText:', text),
    onClick: (callback: () => void) => console.log('MainButton.onClick registered'),
    offClick: (callback: () => void) => console.log('MainButton.offClick registered'),
    show: () => { mockWebApp.MainButton.isVisible = true; console.log('MainButton.show'); },
    hide: () => { mockWebApp.MainButton.isVisible = false; console.log('MainButton.hide'); },
    enable: () => { mockWebApp.MainButton.isActive = true; console.log('MainButton.enable'); },
    disable: () => { mockWebApp.MainButton.isActive = false; console.log('MainButton.disable'); },
    showProgress: (disable?: boolean) => console.log('MainButton.showProgress, disable:', disable),
    hideProgress: () => console.log('MainButton.hideProgress'),
    setParams: (params) => console.log('MainButton.setParams:', params),
  },
  BackButton: {
    isVisible: false,
    onClick: (callback: () => void) => console.log('BackButton.onClick registered'),
    offClick: (callback: () => void) => console.log('BackButton.offClick registered'),
    show: () => { mockWebApp.BackButton.isVisible = true; console.log('BackButton.show'); },
    hide: () => { mockWebApp.BackButton.isVisible = false; console.log('BackButton.hide'); },
  },
  HapticFeedback: {
    impactOccurred: (style) => console.log('HapticFeedback.impactOccurred:', style),
    notificationOccurred: (type) => console.log('HapticFeedback.notificationOccurred:', type),
    selectionChanged: () => console.log('HapticFeedback.selectionChanged'),
  },
  ready: () => console.log('Telegram.WebApp.ready() called'),
  expand: () => console.log('Telegram.WebApp.expand() called'),
  close: () => console.log('Telegram.WebApp.close() called'),
  sendData: (data: string) => console.log('Telegram.WebApp.sendData called with:', data),
};


export const TelegramProvider = ({ children }: PropsWithChildren) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      setWebApp(tg);
      tg.ready(); 
      tg.expand(); 

      if (tg.initDataUnsafe?.user) {
        const tgUser = tg.initDataUnsafe.user;
        setUser({
          id: tgUser.id,
          firstName: tgUser.first_name,
          lastName: tgUser.last_name,
          username: tgUser.username,
          photoUrl: tgUser.photo_url,
        });
      }
      setIsInitializing(false);
    } else {
      console.warn('Telegram WebApp SDK не найден. Используются тестовые данные. Для полной функциональности откройте в Telegram.');
      setWebApp(mockWebApp);
      if (mockWebApp.initDataUnsafe?.user) {
         const tgUser = mockWebApp.initDataUnsafe.user;
         setUser({
          id: tgUser.id,
          firstName: tgUser.first_name,
          lastName: tgUser.last_name,
          username: tgUser.username,
          photoUrl: tgUser.photo_url,
        });
      }
      setIsInitializing(false);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user, isInitializing }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = (): TelegramContextType => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
