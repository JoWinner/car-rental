import { Suspense } from "react";
import { CarCarousel } from "@/components/car/car-carousel";
import { CarsList } from "@/components/car/cars-list";
import { db } from "@/lib/db";
import { CarStatus } from "@prisma/client";

export default async function CarsPage() {
  // Get initial data with pagination and filters
  const initialData = await db.car.findMany({
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

  const total = await db.car.count({
    where: {
      status: CarStatus.AVAILABLE,
    },
  });

  return (
    <div className="py-8 px-4 md:px-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-secondary text-primary">
          Available Cars
        </h1>
        <p className="text-muted-foreground">
          Browse and book from our selection of premium vehicles
        </p>
      </div>
      <Suspense fallback={<div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[300px] rounded-lg bg-gray-100 animate-pulse"
              />
            ))}
          </div>}>
        <CarCarousel cars={initialData} />
      </Suspense>
      <Suspense fallback={<div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[300px] rounded-lg bg-gray-100 animate-pulse"
              />
            ))}
          </div>}>
        <CarsList
          initialData={{
            cars: initialData,
            metadata: {
              total,
              page: 1,
              limit: 9,
              totalPages: Math.ceil(total / 9),
              hasNextPage: total > 9,
              hasPrevPage: false,
            },
          }}
        />
      </Suspense>
    </div>
  );
}
