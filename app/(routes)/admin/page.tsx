import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { isAdminUser } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { AnalyticsCards } from "@/components/admin/analytics-cards";
import { BookingTable } from "@/components/admin/booking-table";
import { CarTable } from "@/components/admin/car-table";
import { CarCalendar } from "@/components/admin/car-calendar";
import { BookingStatus } from "@prisma/client";

export default async function AdminDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin = await isAdminUser(userId);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch analytics data
  const analytics = await db.analytics.findFirst({
    orderBy: {
      date: "desc",
    },
  });

  // Fetch all cars for the calendar
  const cars = await db.car.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Fetch all bookings for the calendar
  const allBookings = await db.booking.findMany({
    include: {
      user: true,
      car: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  // Fetch recent bookings for the table
  const recentBookings = allBookings.slice(0, 10);

  // Fetch cars statistics
  const carsStats = await db.car.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  async function handleViewBooking(booking: any) {
    "use server";
    // Implement view booking details
    // This could redirect to a booking details page
  }

  async function handleConfirmBooking(booking: any) {
    "use server";
    await db.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CONFIRMED },
    });
  }

  return (
    <>
      <AdminHeader
        title="Admin Dashboard"
        description="Manage your car rental business."
      />
      <div className="grid gap-8">
        <AnalyticsCards analytics={analytics} carsStats={carsStats} />

        <div className="space-y-16">
          <div className="my-10">
            <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
            <BookingTable bookings={recentBookings} />
          </div>

          <div className="space-y-8">
            <div className="my-10">
              <h2 className="text-2xl font-bold mb-4">Car Calendar</h2>
              <CarCalendar cars={cars} bookings={allBookings} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Cars Overview</h2>
              <CarTable cars={cars} showActions editUrl="/admin/cars" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
