import { CarBrand, CarCategory, CarStatus } from "@prisma/client";

interface CarsResponse {
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

export async function getCarsList(): Promise<CarsResponse> {
  try {
    const response = await fetch("/api/cars?status=AVAILABLE");
    if (!response.ok) {
      throw new Error("Failed to fetch cars");
    }
    const data: CarsResponse = await response.json();
    return {
      cars: data.cars.map((car) => ({
        ...car,
        carBrand: car.brand,
        carType: car.category,
        carAvg: "25", // Default MPG value
        seat: car.seats,
      })),
      metadata: data.metadata,
    };
  } catch (error) {
    console.error("Error in getCarsList:", error);
    throw error;
  }
}


export async function getFilteredCars(
  params: URLSearchParams
): Promise<CarsResponse> {
  try {
    const response = await fetch(`/api/cars?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch cars");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getFilteredCars:", error);
    throw error;
  }
}

export async function getCarById(id: string) {
  try {
    const response = await fetch(`/api/cars/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch car");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getCarById:", error);
    throw error;
  }
}
