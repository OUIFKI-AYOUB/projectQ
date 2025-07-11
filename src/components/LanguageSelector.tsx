"use client";

import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value);
  };

  return (
    <div className="flex justify-center items-center">
      <select
        onChange={handleLanguageChange}
        value={locale}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="ar">Ar</option>
        <option value="fr">Fr</option>
      </select>
    </div>
  );
}
