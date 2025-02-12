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
import { Switch } from "@/components/ui/switch";
import { CarStatus } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  status: CarStatus;
  year: number;
}

interface CarTableProps {
  cars?: Car[];
  showActions?: boolean;
  editUrl?: string;
}

const statusColors = {
  [CarStatus.AVAILABLE]: "bg-green-100 text-green-800",
  [CarStatus.BOOKED]: "bg-blue-100 text-blue-800",
  [CarStatus.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
  [CarStatus.INACTIVE]: "bg-gray-100 text-gray-800",
} as const;

export function CarTable({
  cars = [],
  showActions = false,
  editUrl,
}: CarTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = async (car: Car) => {
    if (editUrl) {
      router.push(`${editUrl}/${car.id}`);
    }
  };

  const handleStatusToggle = async (car: Car) => {
    try {
      setLoading(car.id);
      const newStatus =
        car.status === CarStatus.AVAILABLE
          ? CarStatus.INACTIVE
          : CarStatus.AVAILABLE;

      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...car,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update car status");
      }

      toast.success("Car status updated", {
        description: `Car is now ${newStatus.toLowerCase()}.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating car status:", error);
      toast.error("Error", {
        description: "Failed to update car status. Please try again.",
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
            <TableHead>Price/Day</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{car.name}</p>
                  <p className="text-sm text-gray-500">
                    {car.brand} {car.model}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p> {car.year}</p>
                </div>
              </TableCell>
              <TableCell>${car.price.toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={statusColors[car.status]}>{car.status}</Badge>
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loading === car.id}
                      onClick={() => handleEdit(car)}
                    >
                      {loading === car.id ? "Loading..." : "Edit"}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={car.status === CarStatus.AVAILABLE}
                        disabled={
                          loading === car.id || car.status === CarStatus.BOOKED
                        }
                        onCheckedChange={() => handleStatusToggle(car)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {car.status === CarStatus.AVAILABLE
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
          {cars.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={showActions ? 5 : 4}
                className="text-center py-8"
              >
                No cars found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
