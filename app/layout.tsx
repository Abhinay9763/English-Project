import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linguadash - English Micro-Learning",
  description: "A simple English micro-learning game with Word of the Day, Idiom of the Day, and Grammar Formula",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

