"use client";

import { useState } from "react";
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
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { BookingDetailsModal } from "@/components/admin/booking-details-modal";
import { toast } from "sonner";

interface Booking {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  user: {
    name: string;
    email: string;
  };
  car: {
    name: string;
    brand: string;
    model: string;
  };
}

interface BookingTableProps {
  bookings: Booking[];
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

export function BookingTable({ bookings }: BookingTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleConfirm = async (booking: Booking) => {
    try {
      setLoading(booking.id);
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: BookingStatus.CONFIRMED }),
      });

      if (!response.ok) throw new Error("Failed to confirm booking");

      toast.success("Booking confirmed", {
        description: "The booking has been confirmed successfully.",
      });
      window.location.reload();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to confirm booking. Please try again.",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {booking.user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.car.name}</p>
                    <p className="text-sm text-gray-500">
                      {booking.car.brand} {booking.car.model}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>From: {formatDate(booking.startDate)}</p>
                    <p>To: {formatDate(booking.endDate)}</p>
                  </div>
                </TableCell>
                <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[booking.status]}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={paymentStatusColors[booking.paymentStatus]}>
                    {booking.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loading === booking.id}
                      onClick={() => handleView(booking)}
                    >
                      {loading === booking.id ? "Loading..." : "View"}
                    </Button>
                    {booking.status === BookingStatus.PENDING && (
                      <Button
                        variant="default"
                        size="sm"
                        disabled={loading === booking.id}
                        onClick={() => handleConfirm(booking)}
                      >
                        {loading === booking.id ? "Loading..." : "Confirm"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBooking(null);
        }}
      />
    </>
  );
}
