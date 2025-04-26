"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { CarBrand, CarCategory } from "@prisma/client"
import { FilterState } from "@/components/shop/types";
import { formatPrice } from "@/lib/utils"

interface DesktopFilterPanelProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
}

export function DesktopFilterPanel({ filters, setFilters }: DesktopFilterPanelProps) {
  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category filter */}
        <div>
          <h3 className="text-sm font-medium mb-3">Category</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="desktop-all-categories"
                checked={filters.category === "all"}
                onCheckedChange={() => setFilters({ ...filters, category: "all" })}
              />
              <Label htmlFor="desktop-all-categories" className="ml-2 text-sm">
                All Categories
              </Label>
            </div>
            {Object.values(CarCategory).map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={`desktop-category-${category}`}
                  checked={filters.category === category}
                  onCheckedChange={() => setFilters({ ...filters, category })}
                />
                <Label htmlFor={`desktop-category-${category}`} className="ml-2 text-sm">
                  {category.replace(/_/g, " ")}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Brand filter */}
        <div>
          <h3 className="text-sm font-medium mb-3">Brand</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <div className="flex items-center">
              <Checkbox
                id="desktop-all-brands"
                checked={filters.brand === "all"}
                onCheckedChange={() => setFilters({ ...filters, brand: "all" })}
              />
              <Label htmlFor="desktop-all-brands" className="ml-2 text-sm">
                All Brands
              </Label>
            </div>
            {Object.values(CarBrand).map((brand) => (
              <div key={brand} className="flex items-center">
                <Checkbox
                  id={`desktop-brand-${brand}`}
                  checked={filters.brand === brand}
                  onCheckedChange={() => setFilters({ ...filters, brand })}
                />
                <Label htmlFor={`desktop-brand-${brand}`} className="ml-2 text-sm">
                  {brand.replace(/_/g, " ")}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range filter */}
        <div>
          <h3 className="text-sm font-medium mb-3">Price Range</h3>
          <div className="space-y-4 px-1">
            <Slider
              defaultValue={[filters.minPrice, filters.maxPrice]}
              min={0}
              max={1000000}
              step={5000}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  minPrice: value[0],
                  maxPrice: value[1],
                })
              }
              className="mt-6"
            />
            <div className="flex items-center justify-between text-sm">
              <span>{formatPrice(filters.minPrice)}</span>
              <span>{formatPrice(filters.maxPrice)}</span>
            </div>
          </div>
        </div>

        {/* Year Range filter */}
        <div>
          <h3 className="text-sm font-medium mb-3">Year</h3>
          <div className="space-y-4 px-1">
            <Slider
              defaultValue={[filters.minYear, filters.maxYear]}
              min={2000}
              max={new Date().getFullYear()}
              step={1}
              value={[filters.minYear, filters.maxYear]}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  minYear: value[0],
                  maxYear: value[1],
                })
              }
              className="mt-6"
            />
            <div className="flex items-center justify-between text-sm">
              <span>{filters.minYear}</span>
              <span>{filters.maxYear}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
