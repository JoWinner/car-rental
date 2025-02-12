"use client";

import { useEffect, useState } from "react";
import { CarsList } from "@/components/car/cars-list";
import Hero from "@/components/home/hero";
import { toast } from "sonner";
import { BookCreatedFlagContext } from "@/context/BookCreatedFlagContext";
import { getCarsList } from "@/services/cars";
import { CarCarousel } from "@/components/car/car-carousel";

interface CarsData {
  cars: any[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function Home() {
  const [carsData, setCarsData] = useState<CarsData>({
    cars: [],
    metadata: {
      total: 0,
      page: 1,
      limit: 9,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  });
  const [showToastMsg, setShowToastMsg] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCarList_();
  }, []);

  const getCarList_ = async () => {
    try {
      setIsLoading(true);
      const result = await getCarsList();
      setCarsData(result);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Failed to fetch cars");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showToastMsg) {
      toast.success("Booking Created Successfully!", {
        description: "Your car has been booked.",
      });
      setShowToastMsg(false);
    }
  }, [showToastMsg]);

  return (
    <div className="py-8 px-14 md:px-20">
      <BookCreatedFlagContext.Provider
        value={{ showToastMsg, setShowToastMsg }}
      >
        <Hero />
        <CarCarousel cars={carsData.cars} />
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[300px] rounded-lg bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <CarsList initialData={carsData} />
        )}
      </BookCreatedFlagContext.Provider>
    </div>
  );
}
