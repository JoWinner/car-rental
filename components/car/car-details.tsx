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

interface CarWithImages extends Car {
  images: { url: string }[];
}

interface CarDetailsProps {
  carId: string;
  similarCars: CarWithImages[];
}

export function CarDetails({ carId, similarCars }: CarDetailsProps) {
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
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div className="mx-10 md:mx-32 py-10 font-primary">
      <div className="flex flex-col gap-8">
        <div className="font-secondary">
          <h1 className="text-3xl font-bold">{car.name}</h1>
          <p className="text-[30px] font-semibold text-primary mt-2">
            ${car.price}/ day
          </p>
        </div>

        <Separator />
        {/* Top - Images */}
        <div className="mx-auto w-3/4 space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={selectedImage}
              alt={car.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-8 gap-2">
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

        {/* Bottom - Details */}
        <div className="space-y-6">
          <Separator />

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Details</h2>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Brand</p>
                  <p className="font-secondary">{car.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="font-secondary">{car.model}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-secondary">{car.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-secondary">{car.category}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-sm mt-2">{car.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Features</h2>
              <div className="grid grid-cols-2 gap-2 mt-2 font-mono">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">
                      {feature.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {car.video && (
              <div>
                <h2 className="text-lg font-semibold">Video Preview</h2>
                <video
                  src={car.video}
                  controls
                  className="w-full mt-2 rounded-lg"
                />
              </div>
            )}
            <div className="w-1/2 mx-auto flex justify-center">
              <Button
                className="w-full font-bold font-secondary text-lg"
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

      <Link href="/cars" className="flex justify-center mt-24">
        <button
          className="p-2 bg-primary text-white
            px-4 rounded-full 
            hover:scale-105 transition-all font-bold font-secondary"
        >
          Find More Cars
        </button>
      </Link>

      <div className="">
        <h2 className="text-2xl font-bold text-center">
          Similar Cars You Might Like
        </h2>
        <CarCarousel cars={similarCars} />
      </div>

      <BookingModal
        car={car}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
}
