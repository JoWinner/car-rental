import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date) {
  return format(date, "PPpp");
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "N/A";
  try {
    const dateObject = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObject.getTime())) return "Invalid date";
    return format(dateObject, "PP");
  } catch (error) {
    return "Invalid date";
  }
}

// export const formatPrice = new Intl.NumberFormat("en-GH", {
//   style: "currency",
//   currency: "GHS",
// });

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(price);
};