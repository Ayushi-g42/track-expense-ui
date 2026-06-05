import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trackexpense | Smart Expense Tracking",
  description: "Track your expenses easily with our modern, premium expense tracker. Beautifully designed, seamless experience.",
};

import StoreProvider from "./StoreProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
