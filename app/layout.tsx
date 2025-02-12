import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans, Bruno_Ace } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-openSans",
  display: "swap",
});

const brunoAce = Bruno_Ace({
  subsets: ["latin"],
  variable: "--font-brunoAce",
  display: "swap",
  weight: "400",
  preload: true,
});

export const metadata: Metadata = {
  title: "Car Rental Service",
  description: "Premium car rental service for your needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-primary antialiased",
            openSans.variable,
            brunoAce.variable
          )}
        >
          <Navbar />
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
