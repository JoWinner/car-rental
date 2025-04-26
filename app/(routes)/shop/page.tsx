import { ShopClient } from "@/components/shop/shop-client";
import { Metadata } from "next";
import Banner from "@/components/home/banner"

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 md:px-14 py-8">
      <Banner/>
      <ShopClient />
    </div>
  );
}
