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
  viewType: "grid" | "list"
  setViewType: (type: "grid" | "list") => void
  clearAllFilters: () => void
}

export function FilterControls({
  activeFilters,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  viewType,
  setViewType,
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

      {/* View type toggle */}
      <div className="hidden sm:flex border rounded-md overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className={cn("rounded-none border-0", viewType === "grid" ? "bg-gray-100" : "bg-transparent")}
          onClick={() => setViewType("grid")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("rounded-none border-0", viewType === "list" ? "bg-gray-100" : "bg-transparent")}
          onClick={() => setViewType("list")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
