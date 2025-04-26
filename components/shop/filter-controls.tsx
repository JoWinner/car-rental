"use client"

import { SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn} from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MobileFilterSheet } from "@/components/shop/mobile-filter-sheet"
import { FilterState } from "@/components/shop/types";

interface FilterControlsProps {
  activeFilters: number
  filters: FilterState
  setFilters: (filters: FilterState) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  clearAllFilters: () => void
}

export function FilterControls({
  activeFilters,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  clearAllFilters,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
      {/* Mobile filter button */}
      <MobileFilterSheet
        activeFilters={activeFilters}
        filters={filters}
        setFilters={setFilters}
        clearAllFilters={clearAllFilters}
      />

      {/* Desktop filter button */}
      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex items-center gap-1"
        onClick={() => setShowFilters(!showFilters)}
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeFilters > 0 && <Badge className="ml-1 bg-red-500 hover:bg-red-600">{activeFilters}</Badge>}
      </Button>

      {/* Sort dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowUpDown size={16} />
            <span className="hidden sm:inline">Sort by:</span>{" "}
            <span className="font-medium">
              {filters.sortBy === "createdAt" ? "Latest" : filters.sortBy === "salePrice" ? "Price" : "Year"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setFilters({ ...filters, sortBy: "createdAt" })}
            className={cn(filters.sortBy === "createdAt" && "font-medium")}
          >
            Latest
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFilters({ ...filters, sortBy: "salePrice" })}
            className={cn(filters.sortBy === "salePrice" && "font-medium")}
          >
            Price
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFilters({ ...filters, sortBy: "year" })}
            className={cn(filters.sortBy === "year" && "font-medium")}
          >
            Year
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
