import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { userProfile } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { BookingHistory } from "@/components/dashboard/booking-history";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await userProfile(userId);

  // Fetch user's bookings with car details
  const bookings = await db.booking.findMany({
    where: {
      userId: user.id,
    },
    include: {
      car: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    // <DashboardShell>
    <>
      <DashboardHeader
        heading="Dashboard"
        text="View your booking history and manage your rentals."
        />
      <div className="grid gap-8">
        <BookingHistory bookings={bookings} />
      </div>
        </>
    // </DashboardShell>
  );
}
