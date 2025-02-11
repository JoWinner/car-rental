import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { PaymentStatus, BookingStatus, CarStatus } from "@prisma/client";
import { isAdminUser } from "@/lib/user-profile";

export async function PATCH(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only admins can update payment status
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { paymentStatus, paymentId } = body;

    if (
      !paymentStatus ||
      !Object.values(PaymentStatus).includes(paymentStatus)
    ) {
      return new NextResponse("Invalid payment status", { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        car: true,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    // Update booking payment status and related fields
    const updatedBooking = await db.booking.update({
      where: { id: params.bookingId },
      data: {
        paymentStatus,
        paymentId,
        // If payment is completed, automatically confirm the booking
        ...(paymentStatus === PaymentStatus.PAID &&
          booking.status === BookingStatus.PENDING && {
            status: BookingStatus.CONFIRMED,
          }),
      },
      include: {
        car: true,
        user: true,
      },
    });

    // If payment is completed and booking was pending, update car status
    if (
      paymentStatus === PaymentStatus.PAID &&
      booking.status === BookingStatus.PENDING
    ) {
      await db.car.update({
        where: { id: booking.carId },
        data: { status: CarStatus.BOOKED },
      });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("[BOOKING_PAYMENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
