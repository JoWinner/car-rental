"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

interface CarWithImages {
  id: string;
  name: string;
  price: number;
  brand: string;
  seats: number;
  carTransmission: string;
  category: string;
  year: number;
  images: { url: string }[];
}

interface CarCarouselProps {
  cars: CarWithImages[];
}

export function CarCarousel({ cars }: CarCarouselProps) {
  const [displayCars, setDisplayCars] = useState<CarWithImages[]>([]);

  const shuffleArray = (array: CarWithImages[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (cars.length > 0) {
      setDisplayCars(shuffleArray(cars).slice(0, 8));
    }
  }, [cars]);

  if (!displayCars.length) return null;

  return (
    <div className="relative w-full py-12 my-28 font-primary">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-100 via-white to-red-200 opacity-70 rounded-xl" />
      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-center text-primary mb-8 font-secondary">
          Featured Cars
        </h2>

        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full max-w-screen-lg mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {displayCars.map((car) => (
              <CarouselItem
                key={car.id}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 py-8"
              >
                <Link href={`/cars/${car.id}`}>
                  <div className="group relative overflow-hidden rounded-3xl shadow-lg bg-white backdrop-blur-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl ">
                    <div className="aspect-[16/9] overflow-hidden rounded-t-3xl">
                      {car.images?.[0]?.url ? (
                        <Image
                          src={car.images[0].url}
                          alt={car.name}
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-200">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-xl font-secondary text-gray-800">
                        {car.name}
                      </h3>
                      <p className="text-sm font-secondary text-gray-600">
                        ${car.price.toFixed(2)}/day
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className="bg-red-100 text-red-800">
                          {car.brand}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          {car.seats} Seats
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800">
                          {car.carTransmission}
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-row gap-2 text-sm text-gray-600">
                        <div>
                          {car.category}
                        </div>
                        <div>
                           {car.year}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white" />
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white" />
        </Carousel>
      </div>
    </div>
  );
}
