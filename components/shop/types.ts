/**
 * Shared type definitions for shop components
 */

export interface Car {
  id: string;
  name: string;
  brand: string;
  seats?: number;
  model: string;
  year: number;
  salePrice: number;
  category: string;
  carTransmission: string;
  description: string;
  onSale: boolean;
  images: { url: string }[];
  mpg?: number;

}

export interface FilterState {
  query: string;
  category: string;
  brand: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  sortBy: string;
  sortOrder: string;
} 