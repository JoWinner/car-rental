import { ShopClient } from "@/components/shop/shop-client";
import Banner from "@/components/home/banner"
import { CarCarousel } from "@/components/car/car-carousel";
import { db } from "@/lib/db";

export default async function ShopPage() {
  const onSaleCars = await db.car.findMany({
    take: 9,
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      onSale: true,
      salePrice: { not: null },
    },
  });

  return (
    <div className="container mx-auto px-4 md:px-14 py-8">
              <CarCarousel cars={onSaleCars} title="Horic Autos Best Deals" />

      <ShopClient />
      <Banner/>
    </div>
  );
}
