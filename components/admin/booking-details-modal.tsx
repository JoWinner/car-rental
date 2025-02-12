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
      <DialogContent className="max-h-screen h-full md:h-auto md:max-h-[85vh] w-full max-w-[90vw] md:max-w-2xl p-4 md:p-6 overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Customer Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid gap-2 text-sm md:text-base">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{booking.user.name}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium break-all">
                  {booking.user.email}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">
                  {booking.user.phoneNumber || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Car Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Car Details</h3>
            <div className="grid gap-2 text-sm md:text-base">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Car:</span>
                <span className="font-medium">{booking.car.name}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Model:</span>
                <span className="font-medium">
                  {booking.car.brand} {booking.car.model}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Year:</span>
                <span className="font-medium">{booking.car.year}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Booking Information</h3>
            <div className="grid gap-2 text-sm md:text-base">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Pickup Date:</span>
                <span className="font-medium">
                  {formatDate(booking.startDate)}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Return Date:</span>
                <span className="font-medium">
                  {formatDate(booking.endDate)}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{booking.location}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground">Total Price:</span>
                <span className="font-medium">
                  ${booking.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col p-2 bg-gray-50 rounded-lg">
                <span className="text-muted-foreground mb-1">Notes:</span>
                <span className="font-medium whitespace-pre-wrap">
                  {booking.notes || "No notes"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="grid gap-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-sm font-medium min-w-[100px]">
                Booking Status:
              </span>
              <div className="flex flex-1 items-center gap-2">
                <Select
                  disabled={isLoading}
                  value={booking.status}
                  onValueChange={(value: BookingStatus) =>
                    handleStatusChange(value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
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
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-sm font-medium min-w-[100px]">
                Payment Status:
              </span>
              <div className="flex flex-1 items-center gap-2">
                <Select
                  disabled={isLoading}
                  value={booking.paymentStatus}
                  onValueChange={(value: PaymentStatus) =>
                    handlePaymentStatusChange(value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
