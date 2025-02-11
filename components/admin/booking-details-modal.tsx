"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface Booking {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  location: string;
  notes?: string | null;
  user: {
    name: string;
    email: string;
    phoneNumber?: string | null;
  };
  car: {
    name: string;
    brand: string;
    model: string;
    year: number;
  };
}

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors = {
  [BookingStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [BookingStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
  [BookingStatus.ACTIVE]: "bg-green-100 text-green-800",
  [BookingStatus.COMPLETED]: "bg-gray-100 text-gray-800",
  [BookingStatus.CANCELLED]: "bg-red-100 text-red-800",
} as const;

const paymentStatusColors = {
  [PaymentStatus.UNPAID]: "bg-red-100 text-red-800",
  [PaymentStatus.PAID]: "bg-green-100 text-green-800",
  [PaymentStatus.REFUNDED]: "bg-purple-100 text-purple-800",
} as const;

export function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: BookingStatus) => {
    if (!booking) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update booking status");

      toast.success("Status updated", {
        description: `Booking status changed to ${status.toLowerCase()}`,
      });
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update booking status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentStatusChange = async (paymentStatus: PaymentStatus) => {
    if (!booking) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings/${booking.id}/payment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update payment status");

      toast.success("Payment status updated", {
        description: `Payment status changed to ${paymentStatus.toLowerCase()}`,
      });
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update payment status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Customer Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <div className="grid gap-2">
              <div>
                <span className="text-muted-foreground">Name:</span>{" "}
                {booking.user.name}
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                {booking.user.email}
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>{" "}
                {booking.user.phoneNumber || "Not provided"}
              </div>
            </div>
          </div>

          {/* Car Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Car Details</h3>
            <div className="grid gap-2">
              <div>
                <span className="text-muted-foreground">Car:</span>{" "}
                {booking.car.name}
              </div>
              <div>
                <span className="text-muted-foreground">Model:</span>{" "}
                {booking.car.brand} {booking.car.model}
              </div>
              <div>
                <span className="text-muted-foreground">Year:</span>{" "}
                {booking.car.year}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Booking Information</h3>
            <div className="grid gap-2">
              <div>
                <span className="text-muted-foreground">Pickup Date:</span>{" "}
                {formatDate(booking.startDate)}
              </div>
              <div>
                <span className="text-muted-foreground">Return Date:</span>{" "}
                {formatDate(booking.endDate)}
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>{" "}
                {booking.location}
              </div>
              <div>
                <span className="text-muted-foreground">Total Price:</span> $
                {booking.totalPrice.toFixed(2)}
              </div>
              <div>
                <span className="text-muted-foreground">Notes:</span>{" "}
                {booking.notes || "No notes"}
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="grid gap-4 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Booking Status:</span>
              <Select
                disabled={isLoading}
                value={booking.status}
                onValueChange={(value: BookingStatus) =>
                  handleStatusChange(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BookingStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge className={statusColors[booking.status]}>
                {booking.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Payment Status:</span>
              <Select
                disabled={isLoading}
                value={booking.paymentStatus}
                onValueChange={(value: PaymentStatus) =>
                  handlePaymentStatusChange(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge className={paymentStatusColors[booking.paymentStatus]}>
                {booking.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
