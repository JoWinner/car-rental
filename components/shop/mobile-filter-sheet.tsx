"use client"

import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { CarBrand, CarCategory, CarTransmission } from "@prisma/client"
import { FilterState } from "@/components/shop/types";
import { formatPrice } from "@/lib/utils"

interface MobileFilterSheetProps {
  activeFilters: number
  filters: FilterState
  setFilters: (filters: FilterState) => void
  clearAllFilters: () => void
}

export function MobileFilterSheet({
  activeFilters,
  filters,
  setFilters,
  clearAllFilters,

}: MobileFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden flex items-center gap-1">
          <Filter size={16} />
          Filters
          {activeFilters > 0 && <Badge className="ml-1 bg-red-500 hover:bg-red-600">{activeFilters}</Badge>}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine your search with the following filters</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {activeFilters > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="mb-4 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <X size={14} className="mr-1" />
              Clear All Filters
            </Button>
          )}

          <Accordion type="single" collapsible className="w-full">
            {/* Category filter */}
            <AccordionItem value="category">
              <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="all-categories"
                      checked={filters.category === "all"}
                      onCheckedChange={() => setFilters({ ...filters, category: "all" })}
                    />
                    <Label htmlFor="all-categories" className="ml-2 text-sm">
                      All Categories
                    </Label>
                  </div>
                  {Object.values(CarCategory).map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.category === category}
                        onCheckedChange={() => setFilters({ ...filters, category })}
                      />
                      <Label htmlFor={`category-${category}`} className="ml-2 text-sm">
                        {category.replace(/_/g, " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Brand filter */}
            <AccordionItem value="brand">
              <AccordionTrigger className="text-sm font-medium">Brand</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <div className="flex items-center">
                    <Checkbox
                      id="all-brands"
                      checked={filters.brand === "all"}
                      onCheckedChange={() => setFilters({ ...filters, brand: "all" })}
                    />
                    <Label htmlFor="all-brands" className="ml-2 text-sm">
                      All Brands
                    </Label>
                  </div>
                  {Object.values(CarBrand).map((brand) => (
                    <div key={brand} className="flex items-center">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={filters.brand === brand}
                        onCheckedChange={() => setFilters({ ...filters, brand })}
                      />
                      <Label htmlFor={`brand-${brand}`} className="ml-2 text-sm">
                        {brand.replace(/_/g, " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Transmission filter */}
            <AccordionItem value="transmission">
              <AccordionTrigger className="text-sm font-medium">Transmission</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="all-transmissions"
                      checked={filters.transmission === "all"}
                      onCheckedChange={() => setFilters({ ...filters, transmission: "all" })}
                    />
                    <Label htmlFor="all-transmissions" className="ml-2 text-sm">
                      All Transmissions
                    </Label>
                  </div>
                  {Object.values(CarTransmission).map((transmission) => (
                    <div key={transmission} className="flex items-center">
                      <Checkbox
                        id={`transmission-${transmission}`}
                        checked={filters.transmission === transmission}
                        onCheckedChange={() => setFilters({ ...filters, transmission })}
                      />
                      <Label htmlFor={`transmission-${transmission}`} className="ml-2 text-sm">
                        {transmission}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price Range filter */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
              <AccordionContent>
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
              </AccordionContent>
            </AccordionItem>

            {/* Year Range filter */}
            <AccordionItem value="year">
              <AccordionTrigger className="text-sm font-medium">Year</AccordionTrigger>
              <AccordionContent>
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full bg-red-500 hover:bg-red-600">Apply Filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
