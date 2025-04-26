import { Suspense } from "react";
import { ShopCarDetails } from "@/components/shop/shop-car-details";
import { db } from "@/lib/db";

export default async function ShopCarPage({
  params,
}: {
  params: { carId: string };
}) {
  // Fetch similar cars for the carousel (cars on sale)
  const similarCars = await db.car.findMany({
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
    <Suspense fallback={<div>Loading...</div>}>
      <ShopCarDetails carId={params.carId} similarCars={similarCars} />
    </Suspense>
  );
}
