"use client"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  clearAllFilters: () => void
}

export function EmptyState({ clearAllFilters }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
      <p className="text-gray-600 mb-4">Try adjusting your filters to find what you're looking for.</p>
      <Button onClick={clearAllFilters} className="bg-red-500 hover:bg-red-600">
        Clear All Filters
      </Button>
    </div>
  )
}
