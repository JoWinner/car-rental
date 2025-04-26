import { Suspense } from "react";
import { RentCarDetails } from "@/components/car/rent-car-details";
import { db } from "@/lib/db";
import { CarStatus } from "@prisma/client";

export default async function RentCarPage({
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
      <RentCarDetails carId={params.carId} similarCars={similarCars} />
    </Suspense>
  );
}
