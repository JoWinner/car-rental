import Image from "next/image";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
interface BookingHistoryProps {
  bookings: any[];
  isAdmin?: boolean;
}

const statusColors = {
  [BookingStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [BookingStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
  [BookingStatus.ACTIVE]: "bg-green-100 text-green-800",
  [BookingStatus.COMPLETED]: "bg-gray-100 text-gray-800",
  [BookingStatus.CANCELLED]: "bg-red-100 text-red-800",
};

const paymentStatusColors = {
  [PaymentStatus.UNPAID]: "bg-red-100 text-red-800",
  [PaymentStatus.PAID]: "bg-green-100 text-green-800",
  [PaymentStatus.REFUNDED]: "bg-purple-100 text-purple-800",
};

export function BookingHistory({
  bookings,
  isAdmin = false,
}: BookingHistoryProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Car</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            {isAdmin && <TableHead>User</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden">
                    <Image
                      src={booking.car.images[0]?.url || "/placeholder-car.png"}
                      alt={booking.car.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{booking.car.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.car.brand} {booking.car.model}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>From: {format(new Date(booking.startDate), "PPP")}</p>
                  <p>To: {format(new Date(booking.endDate), "PPP")}</p>
                </div>
              </TableCell>
              <TableCell>{formatPrice(booking.totalPrice)}</TableCell>
              <TableCell>
                <Badge
                  className={statusColors[booking.status as BookingStatus]}
                >
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    paymentStatusColors[booking.paymentStatus as PaymentStatus]
                  }
                >
                  {booking.paymentStatus}
                </Badge>
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {booking.user.email}
                    </p>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8">
                No bookings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
