"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignOutButton,
  useUser,
  UserButton,
} from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const routes = [
  // { href: '/submissions', label: 'Submissions' },
  // { href: '/submit', label: 'Submit' },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky px-8 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden w-full md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={20}
              height={20}
              className="h-16 w-24"
            />
          </Link>
          <nav className="flex items-center justify-end w-full space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={
                  pathname === route.href
                    ? "text-foreground"
                    : "text-foreground/60 transition-colors hover:text-foreground"
                }
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <ChevronDown className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="w-full h-[50vh] border-b-2">
            <div className="flex items-center justify-between mb-4 pr-4">
              <MobileLink
                href="/"
                className="flex items-center"
                onOpenChange={setIsOpen}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="h-16 w-24"
                />
              </MobileLink>
             
            </div>
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-lg">
              {routes.map((route) => (
                <MobileLink
                  key={route.href}
                  href={route.href}
                  onOpenChange={setIsOpen}
                  className="text-center"
                >
                  {route.label}
                </MobileLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="flex items-center">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  Sign in
                </Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

interface MobileLinkProps {
  href: string;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
}: MobileLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={`${className} ${
        pathname === href
          ? "text-foreground"
          : "text-foreground/60 transition-colors hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
