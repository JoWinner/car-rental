"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Car } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TermsAndConditions } from "@/components/layout/terms-and-conditions";
import BookingModal from "@/components/booking/booking-modal";
import { CarCarousel } from "@/components/car/car-carousel";
import { formatPrice } from "@/lib/utils";

interface CarWithImages extends Car {
  images: { url: string }[];
}

interface CarDetailsProps {
  carId: string;
  similarCars: any[];
}

export function RentCarDetails({ carId, similarCars }: CarDetailsProps) {
  const [car, setCar] = useState<CarWithImages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${carId}`);
        const data = await response.json();
        setCar(data);
        setSelectedImage(data.images[0]?.url || "");
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (carId) {
      fetchCar();
    }
  }, [carId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl">Car not found</div>
      </div>
    );
  }

  return (
    <div className="mx-4 md:mx-32 py-6 md:py-10 font-primary">
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="font-secondary">
          <h1 className="text-3xl md:text-4xl font-bold">{car.name}</h1>
          <p className="text-3xl md:text-[40px] font-semibold text-primary mt-2">
            {formatPrice(car.rentPrice || 0)}
            <span className="text-lg md:text-xl font-normal">/day</span>
          </p>
        </div>

        <Separator />

        {/* Images Section */}
        <div className="w-full md:w-3/4 mx-auto space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={selectedImage}
              alt={car.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {car.images.map((image) => (
              <div
                key={image.url}
                className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden ${
                  selectedImage === image.url ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <Separator />

          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4">
                Details
              </h2>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Brand</p>
                  <p className="text-lg md:text-xl font-secondary">
                    {car.brand}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="text-lg md:text-xl font-secondary">
                    {car.model}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="text-lg md:text-xl font-secondary">
                    {car.year}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-lg md:text-xl font-secondary">
                    {car.category.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4">
                Description
              </h2>
              <p className="text-base md:text-lg">{car.description}</p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4">
                Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 font-mono">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-base md:text-lg">
                      {feature.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {car.video && (
              <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                  Video Preview
                </h2>
                <video
                  src={car.video}
                  controls
                  className="w-full rounded-lg"
                  poster={car.images[0]?.url}
                />
              </div>
            )}

            <div className="flex justify-center py-4 md:py-6">
              <Button
                className="w-full md:w-1/2 font-bold font-secondary text-lg md:text-xl py-6 md:py-8"
                size="lg"
                onClick={() => setShowBookingModal(true)}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <TermsAndConditions />
      </div>

      <div className="flex justify-center mt-16 md:mt-24">
        <Link href="/cars">
          <Button className="px-6 py-3 bg-primary text-white rounded-full hover:scale-105 transition-all font-bold font-secondary text-base md:text-lg">
            Find More Cars
          </Button>
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Similar Cars You Might Like
        </h2>

        <CarCarousel cars={similarCars} title="Featured Cars You Can Rent" />
      </div>

      <BookingModal
        car={{
          id: car.id,
          name: car.name,
          brand: car.brand,
          model: car.model,
          rentPrice: car.rentPrice || 0,
          images: car.images,
        }}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
}
