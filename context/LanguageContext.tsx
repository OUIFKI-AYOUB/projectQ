"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with default value, will be updated in useEffect
  const [locale, setLocale] = useState('ar');

  useEffect(() => {
    // This only runs on client side after hydration
    const storedLocale = localStorage.getItem('locale') || 'ar';
    setLocale(storedLocale);
  }, []);

  // Update localStorage when the locale changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};