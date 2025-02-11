import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { isAdminUser } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { CarTable } from "@/components/admin/car-table";

export default async function AdminCarsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin = await isAdminUser(userId);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch all cars
  const cars = await db.car.findMany({
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <AdminHeader
        title="Car Management"
        description="Add, edit, and manage your car fleet."
        action={{
          label: "Add car",
          href: "/admin/cars/new",
        }}
      />
      <div>
        <h2 className="text-2xl font-bold mb-4">Car Fleet</h2>
        <CarTable cars={cars} showActions editUrl="/admin/cars" />
      </div>
    </>
  );
}
