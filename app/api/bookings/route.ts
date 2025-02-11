import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { userProfile } from "@/lib/user-profile";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user profile ID
    const user = await userProfile();
    if (!user) {
      return new NextResponse("User profile not found", { status: 404 });
    }

    const body = await req.json();
    const { carId, startDate, endDate, totalPrice, notes, location } = body;

    if (!carId || !startDate || !endDate || !totalPrice || !location) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if car exists and is available
    const car = await db.car.findUnique({
      where: { id: carId, status: "AVAILABLE" },
    });

    if (!car) {
      return new NextResponse("Car not found or unavailable", { status: 404 });
    }

    // Check for overlapping bookings
    const overlappingBooking = await db.booking.findFirst({
      where: {
        carId,
        status: "CONFIRMED",
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } },
            ],
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      return new NextResponse("Car is not available for selected dates", {
        status: 400,
      });
    }

    // Create the booking
    const booking = await db.booking.create({
      data: {
        userId: user.id,
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        location,
        notes,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
      },
      include: {
        car: true,
      },
    });

    // Update car status to BOOKED
    await db.car.update({
      where: { id: carId },
      data: { status: "BOOKED" },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[BOOKINGS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bookings = await db.booking.findMany({
      where: { userId },
      include: {
        car: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[BOOKINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
