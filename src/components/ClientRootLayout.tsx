"use client"; // Mark this as a Client Component

import { useLanguage } from "../../context/LanguageContext";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useLanguage(); // Get the current locale

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>{children}</body>
    </html>
  );
}