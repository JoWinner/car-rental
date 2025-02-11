import { Suspense } from "react";
import { CarDetails } from "@/components/car/car-details";
import { db } from "@/lib/db";
import { CarStatus } from "@prisma/client";

export default async function CarPage({
  params,
}: {
  params: { carId: string };
}) {
  // Fetch similar cars for the carousel
  const similarCars = await db.car.findMany({
    take: 9,
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      status: CarStatus.AVAILABLE,
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarDetails carId={params.carId} similarCars={similarCars} />
    </Suspense>
  );
}
