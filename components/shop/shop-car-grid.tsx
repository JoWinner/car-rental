import { ShopCarCard } from "@/components/shop/shop-car-card";
import { Car } from "@/components/shop/types";

interface CarGridProps {
  cars: Car[];
}

export function ShopCarGrid({ cars }: CarGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <ShopCarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
