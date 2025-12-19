import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/components/UserContext";
import LoginModal from "@/components/LoginModal";
import UserBadge from "@/components/UserBadge";

export const metadata: Metadata = {
  title: "Linguadash - SMEC Project Expo",
  description: "English Micro-Learning Project by St. Martin's Engineering College",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <LoginModal />
          <UserBadge />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

