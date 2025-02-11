import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { BookingStatus, CarStatus } from "@prisma/client";
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

    const body = await req.json();
    const { status } = body;

    if (!status || !Object.values(BookingStatus).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
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

    // Check if user is admin or the booking owner
    const isAdmin = await isAdminUser(userId);
    const isOwner = booking.userId === userId;

    if (!isAdmin && !isOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update car status based on booking status
    let carStatus: CarStatus;
    switch (status) {
      case BookingStatus.CONFIRMED:
      case BookingStatus.ACTIVE:
        carStatus = CarStatus.BOOKED;
        break;
      case BookingStatus.COMPLETED:
      case BookingStatus.CANCELLED:
        carStatus = CarStatus.AVAILABLE;
        break;
      default:
        carStatus = booking.car.status;
    }

    // Update booking and car status
    const updatedBooking = await db.booking.update({
      where: { id: params.bookingId },
      data: {
        status,
        // If cancelling, set payment status to REFUNDED if it was PAID
        ...(status === BookingStatus.CANCELLED &&
          booking.paymentStatus === "PAID" && {
            paymentStatus: "REFUNDED",
          }),
      },
      include: {
        car: true,
        user: true,
      },
    });

    // Update car status
    await db.car.update({
      where: { id: booking.carId },
      data: { status: carStatus },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("[BOOKING_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
