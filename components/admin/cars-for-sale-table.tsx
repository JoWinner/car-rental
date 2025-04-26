"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CarStatus } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  salePrice: number | null;
  status: CarStatus;
  year: number;
  onSale: boolean;
  images?: { url: string }[];
}

interface CarsForSaleTableProps {
  cars: Car[];
}

export function CarsForSaleTable({ cars = [] }: CarsForSaleTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = (carId: string) => {
    router.push(`/admin/cars/${carId}`);
  };

  const handleRemoveFromSale = async (car: Car) => {
    try {
      setLoading(car.id);

      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onSale: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update car");
      }

      toast.success("Car removed from sale", {
        description: `${car.name} is no longer listed for sale.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error removing car from sale:", error);
      toast.error("Error", {
        description: "Failed to remove car from sale. Please try again.",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Car</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Sale Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  {car.images && car.images[0] && (
                    <div className="relative h-12 w-12 rounded-md overflow-hidden">
                      <Image
                        src={car.images[0].url}
                        alt={car.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{car.name}</p>
                    <p className="text-sm text-gray-500">
                      {car.brand} {car.model}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{car.year}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-primary">
                  {formatPrice(car.salePrice || 0)}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    car.status === CarStatus.AVAILABLE
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {car.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(car.id)}
                    disabled={loading === car.id}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFromSale(car)}
                    disabled={loading === car.id}
                  >
                    {loading === car.id ? "Processing..." : "Remove from Sale"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {cars.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No cars currently on sale.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
