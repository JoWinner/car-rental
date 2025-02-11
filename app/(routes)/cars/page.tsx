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
    <div className="py-8 px-14 md:px-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-secondary text-primary">Available Cars</h1>
        <p className="text-muted-foreground">
          Browse and book from our selection of premium vehicles
        </p>
      </div>
      <CarCarousel cars={initialData} />
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
    </div>
  );
}
