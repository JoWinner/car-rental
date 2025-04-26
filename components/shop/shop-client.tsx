"use client";

import { useEffect, useState } from "react";
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/shop/search-bar";
import { FilterControls } from "@/components/shop/filter-controls";
import { ActiveFilters } from "@/components/shop/active-filters";
import { DesktopFilterPanel } from "@/components/shop/desktop-filter-panel";
import { ShopCarGrid } from "@/components/shop/shop-car-grid";
import { EmptyState } from "@/components/shop/empty-state";
import { LoadingState } from "@/components/shop/loading-state";
import { Car, FilterState } from "@/components/shop/types";

export function ShopClient() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    category: "all",
    brand: "all",
    transmission: "all",
    minPrice: 0,
    maxPrice: 1000000,
    minYear: 2000,
    maxYear: new Date().getFullYear(),
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      // Add onSale=true to always fetch only cars for sale
      params.append("onSale", "true");

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all" && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/shop?${params.toString()}`);
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();

    // Count active filters
    let count = 0;
    if (filters.category !== "all") count++;
    if (filters.brand !== "all") count++;
    if (filters.transmission !== "all") count++;
    if (filters.minPrice > 0 || filters.maxPrice < 1000000) count++;
    if (filters.minYear > 2000 || filters.maxYear < new Date().getFullYear())
      count++;
    if (filters.query) count++;
    setActiveFilters(count);
  }, [filters]);

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      query: "",
      category: "all",
      brand: "all",
      transmission: "all",
      minPrice: 0,
      maxPrice: 1000000,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header with title */}
      <div className=" flex items-center justify-center">
      <div className="flex items-center rounded-full overflow-hidden shadow-lg">
          <Link
            href="/shop"
            className={cn(
              "bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3",
              "transition-all duration-300 flex items-center justify-center font-secondary",
            )}
          >
            Buy Your Dream Car
          </Link>
        </div>
    </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className=" text-xl sm:text-zxl text-gray-400 mb-3 font-secondary"
          >Cars For Sale
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse our collection of premium vehicles available for purchase
          </p>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search input */}
          <SearchBar
            value={filters.query}
            onChange={(value) => setFilters({ ...filters, query: value })}
          />

          {/* Filter controls */}
          <FilterControls
            activeFilters={activeFilters}
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            clearAllFilters={clearAllFilters}
          />
        </div>

        {/* Active filters display */}
        {activeFilters > 0 && (
          <ActiveFilters
            filters={filters}
            setFilters={setFilters}
            clearAllFilters={clearAllFilters}
          />
        )}
      </div>

      {/* Desktop expanded filters */}
      {showFilters && (
        <DesktopFilterPanel
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {/* Results count */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing <span className="font-medium">{cars.length}</span> cars for
          sale
        </p>
      </div>

      {/* Car listings */}
      {loading ? (
        <LoadingState />
      ) : cars.length === 0 ? (
        <EmptyState clearAllFilters={clearAllFilters} />
      ) :  (
        <ShopCarGrid cars={cars} />
      )
      }
    </div>
  );
}
