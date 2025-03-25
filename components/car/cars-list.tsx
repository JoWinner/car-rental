"use client";

import { useEffect, useState } from "react";
import { CarBrand, CarCategory, CarStatus } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CarCard from "@/components/car/car-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CarsListProps {
  initialData?: {
    cars: any[];
    metadata: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  carsList?: any[];
}

export function CarsList({ initialData, carsList }: CarsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(
    initialData || {
      cars: carsList || [],
      metadata: {
        total: carsList?.length || 0,
        page: 1,
        limit: carsList?.length || 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  );

  // Filter states
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [brand, setBrand] = useState<string>(
    searchParams.get("brand") || "all"
  );
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [minPrice, setMinPrice] = useState(
    parseInt(searchParams.get("minPrice") || "0")
  );
  const [maxPrice, setMaxPrice] = useState(
    parseInt(searchParams.get("maxPrice") || "10000")
  );
  const [minSeats, setMinSeats] = useState(
    parseInt(searchParams.get("minSeats") || "0")
  );

  const handleSearch = () => {
    updateFilters({ search: searchInput });
  };

  const updateFilters = (updates: Record<string, any>) => {
    // Create a new URLSearchParams from the current searchParams
    const params = new URLSearchParams(searchParams.toString());

    // Rest of the code remains the same
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    params.set("status", "AVAILABLE");
    router.push(`?${params.toString()}`, { scroll: false });
    fetchCars(1, params);
  };

  const fetchCars = async (page = 1, params?: URLSearchParams) => {
    try {
      setIsLoading(true);

      const queryParams =
        params ||
        new URLSearchParams({
          page: page.toString(),
          limit: "9",
          status: "AVAILABLE",
          ...(searchInput && { search: searchInput }),
          ...(brand !== "all" && { brand }),
          ...(category !== "all" && { category }),
          ...(minPrice > 0 && { minPrice: minPrice.toString() }),
          ...(maxPrice < 1000 && { maxPrice: maxPrice.toString() }),
          ...(minSeats > 0 && { minSeats: minSeats.toString() }),
        });

      const response = await fetch(`/api/cars?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch cars");

      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    fetchCars(1, params);
  }, []);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="mt-4 sm:mt-5">
        <h2 className="text-center text-lg sm:text-xl text-gray-400 mb-3 font-secondary">
          Let's find your perfect car
        </h2>
        <div className="flex justify-center">
          <div className="flex bg-gray-100 p-2 px-4 gap-2 rounded-full items-center w-full max-w-xl">
            <button
              onClick={handleSearch}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search for cars..."
              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent w-full text-base"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label className="text-sm sm:text-base">Brand</Label>
          <Select
            value={brand}
            onValueChange={(value) => {
              setBrand(value);
              updateFilters({ brand: value });
            }}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {Object.values(CarBrand).map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              updateFilters({ category: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {Object.values(CarCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Minimum Seats</Label>
          <Select
            value={minSeats.toString()}
            onValueChange={(value) => {
              const seats = parseInt(value);
              setMinSeats(seats);
              updateFilters({ minSeats: seats });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any seats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any seats</SelectItem>
              {[2, 4, 5, 7, 8].map((seats) => (
                <SelectItem key={seats} value={seats.toString()}>
                  {seats}+ seats
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cars Grid */}
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.cars.map((car: any) => (
            <CarCard key={car.id} car={car} />
          ))}
          {data?.cars.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No cars found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data?.metadata.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchCars(data.metadata.page - 1)}
                disabled={!data.metadata.hasPrevPage}
                className={cn(
                  "cursor-pointer",
                  !data.metadata.hasPrevPage && "pointer-events-none opacity-50"
                )}
              >
                <PaginationPrevious className="h-4 w-4" />
              </Button>
            </PaginationItem>
            {Array.from({ length: data.metadata.totalPages }).map((_, i) => (
              <PaginationItem key={i + 1}>
                <Button
                  variant={data.metadata.page === i + 1 ? "default" : "outline"}
                  size="icon"
                  onClick={() => fetchCars(i + 1)}
                >
                  {i + 1}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchCars(data.metadata.page + 1)}
                disabled={!data.metadata.hasNextPage}
                className={cn(
                  "cursor-pointer",
                  !data.metadata.hasNextPage && "pointer-events-none opacity-50"
                )}
              >
                <PaginationNext className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
