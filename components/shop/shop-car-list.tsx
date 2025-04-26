import Image from "next/image";
import { Heart, MapPin, Calendar, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Car } from "@/components/shop/types";
import { formatPrice } from "@/lib/utils"

interface CarListProps {
  cars: Car[];
}

export function ShopCarList({ cars }: CarListProps) {
  return (
    <div className="space-y-4">
      {cars.map((car) => (
        <Card
          key={car.id}
          className="overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 relative">
              <div className="aspect-video sm:h-full relative">
                <Image
                  src={car.images[0]?.url || "/placeholder.svg"}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                  Sale
                </div>
                <Badge className="absolute top-2 left-2 bg-zinc-900/80 backdrop-blur-sm">
                  {car.category.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>

            <div className="p-4 flex-1">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-zinc-900">
                      {car.name}
                    </h3>
                    <div>
                      <p className="font-bold text-lg text-red-500 text-right">
                        {formatPrice(car.salePrice)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <span className="text-muted-foreground">
                      {car.brand} {car.model}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {car.description ||
                      "This premium vehicle offers exceptional comfort and performance. Featuring the latest technology and safety features."}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">{car.carTransmission}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t">
                  <Button className="w-full bg-red-500 hover:bg-red-600">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
