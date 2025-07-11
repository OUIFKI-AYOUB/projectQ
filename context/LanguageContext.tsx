"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage for the saved locale, default to 'ar' if not found
  const storedLocale = localStorage.getItem('locale') || 'ar';
  const [locale, setLocale] = useState(storedLocale);

  // Update localStorage when the locale changes
  useEffect(() => {
    localStorage.setItem('locale', locale);
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
