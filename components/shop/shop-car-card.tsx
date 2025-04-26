import Image from "next/image";
import Link from "next/link";

import { FaGasPump, FaCalendar } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { PiSteeringWheelFill } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Car } from "@/components/shop/types";
import { formatPrice } from "@/lib/utils"

interface CarCardProps {
  car: Car;
}

export function ShopCarCard({ car }: CarCardProps) {
  const mpg = car?.mpg || "N/A";

  return (
    <Link href={`/shop/${car.id}`} className="block">
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-transparent hover:border-primary">
        <div className="aspect-video relative">
          <Image
            src={car.images[0]?.url || "/placeholder.svg"}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">

          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold font-secondary text-lg text-zinc-900 line-clamp-1">
              {car.name}
            </h3>
            <div className=" flex flex-row text-center text-gray-500 gap-2 ">
              <FaCalendar className="text-lg sm:text-xl" />
              <h2 className="text-sm font-light">{car.year}</h2>
            </div>
          </div>

          <div className="flex justify-around  gap-2 mb-4">
            <div className="text-center text-gray-500">
              <PiSteeringWheelFill className="w-full text-lg sm:text-xl mb-2" />
              <h2 className=" text-sm font-light">
                {car.category.replace(/_/g, " ")}
              </h2>
            </div>
            <div className="text-center text-gray-500">
              <MdAirlineSeatReclineNormal className="w-full text-lg sm:text-xl mb-2" />
              <h2 className="text-sm font-light">
                {car.seats} Seats
              </h2>
            </div>
            <div className="text-center text-gray-500">
              <FaGasPump className="w-full text-lg sm:text-xl mb-2" />
              <h2 className="text-sm font-light">{mpg} MPG</h2>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="font-bold font-secondary text-lg text-primary">
                {formatPrice(car.salePrice)}
              </p>
            </div>
            <Badge className="bg-zinc-900/80 backdrop-blur-sm">
              {car.brand.replace(/_/g, " ")}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
