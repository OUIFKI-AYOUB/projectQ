import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "../../context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import ClientRootLayout from "@/components/ClientRootLayout";
import { Toaster } from "react-hot-toast"; // Import Toaster
import { Navbar } from "@/components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Queue Management System",
  description: "Manage your queues efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      {/* Use the ClientRootLayout component */}
      <ClientRootLayout>
        <SessionProvider>
          <Navbar />
        <header className="flex items-center justify-between px-4 py-2 bg-gray-100">
            <div className="flex items-center space-x-4">
              <LanguageSelector />
            </div>
          </header>
          <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster position="top-center" reverseOrder={false} /> 

            {children}
          </main>
        </SessionProvider>
      </ClientRootLayout>
    </LanguageProvider>
  );
}