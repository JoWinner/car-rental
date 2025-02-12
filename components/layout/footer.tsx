// import { siteConfig } from "config/site";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="border-t  border-border/40 bg-violet-900 backdrop-blur supports-[backdrop-filter]:bg-violet-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
        <Link href="/"  className="">
            <Image
              src="/logo.png"
              alt="Logo"
              width={20}
              height={20}
              className="h-16 w-24"
            />
            <p className="text-sm text-gray-200"> Flag house 2xx Adinkra Street , Accra,Ghana </p>
          </Link>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms-of-service">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect</h4>
            <div className="flex space-x-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/facebook-logo.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="h-10 w-10"
                />
              </a>
              <a
                href="https://x.com/jowinner_"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/tiktok-logo.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="h-10 w-10"
                />
              </a>
              <a
                href="https://x.com/jowinner_"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/instagram-logo.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="h-10 w-10"
                />
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="flex flex-col space-y-2 text-base text-gray-200">
              <h1>hello@fcarrental.com</h1>
            <p className="text-sm">
              Call Us: +233 000 111 12 , +233 123 123 123 We’re open from
              Mon-Saturday 9am-5pm
            </p>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-border/40 pt-8 text-center text-base text-gray-200">
          © {new Date().getFullYear()} Car Rental. All rights reserved.
        </div>
      </div>
    </div>
  );
}
