"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "../../context/LanguageContext"; // Import useLanguage

const SignOut = () => {
  const { locale } = useLanguage(); // Get the current locale

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" }); // Redirect to sign-in page after sign-out
  };

  return (
    <div
      className="absolute top-2"
      style={{
        right: locale === "ar" ? "auto" : "1rem", // Adjust for RTL
        left: locale === "ar" ? "1rem" : "auto", // Adjust for LTR
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage  alt="User" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
            <span className="flex-1 cursor-pointer">
              {locale === "ar" ? "تسجيل الخروج" : "Sign out"} {/* Localized text */}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { SignOut };