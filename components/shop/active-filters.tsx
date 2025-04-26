"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/components/shop/types";
import { formatPrice } from "@/lib/utils"

interface ActiveFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearAllFilters: () => void;
}

export function ActiveFilters({
  filters,
  setFilters,
  clearAllFilters,
}: ActiveFiltersProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {filters.category !== "all" && (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
        >
          Category: {filters.category.replace(/_/g, " ")}
          <X
            size={14}
            className="ml-1 cursor-pointer"
            onClick={() => setFilters({ ...filters, category: "all" })}
          />
        </Badge>
      )}
      {filters.brand !== "all" && (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
        >
          Brand: {filters.brand.replace(/_/g, " ")}
          <X
            size={14}
            className="ml-1 cursor-pointer"
            onClick={() => setFilters({ ...filters, brand: "all" })}
          />
        </Badge>
      )}
      {filters.transmission !== "all" && (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
        >
          Transmission: {filters.transmission}
          <X
            size={14}
            className="ml-1 cursor-pointer"
            onClick={() => setFilters({ ...filters, transmission: "all" })}
          />
        </Badge>
      )}
      {(filters.minPrice > 0 || filters.maxPrice < 1000000) && (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
        >
          Price: {formatPrice(filters.minPrice)} -{" "}
          {formatPrice(filters.maxPrice)}
          <X
            size={14}
            className="ml-1 cursor-pointer"
            onClick={() =>
              setFilters({ ...filters, minPrice: 0, maxPrice: 1000000 })
            }
          />
        </Badge>
      )}
      {(filters.minYear > 2000 ||
        filters.maxYear < new Date().getFullYear()) && (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
        >
          Year: {filters.minYear} - {filters.maxYear}
          <X
            size={14}
            className="ml-1 cursor-pointer"
            onClick={() =>
              setFilters({
                ...filters,
                minYear: 2000,
                maxYear: new Date().getFullYear(),
              })
            }
          />
        </Badge>
      )}
      {filters.query && (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
        >
          Search: {filters.query}
          <X
            size={14}
            className="ml-1 cursor-pointer"
            onClick={() => setFilters({ ...filters, query: "" })}
          />
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
      >
        Clear All
      </Button>
    </div>
  );
}
