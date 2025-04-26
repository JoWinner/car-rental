import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { CarsForRentTable } from "@/components/admin/cars-for-rent-table";

export default async function AdminCarsForRentPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin = await isAdminUser(userId);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch cars placed on rent
  const carsForRent = await db.car.findMany({
    include: {
      images: true,
    },
    where: {
      onRent: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <AdminHeader
        title="Cars For Rent"
        description="Manage your cars that are available for rent."
        action={{
          label: "Add car for rent",
          href: "/admin/cars/new",
        }}
      />
      <div>
        <h2 className="text-2xl font-bold mb-4">Cars Currently For Rent</h2>
        <CarsForRentTable cars={carsForRent} />
      </div>
    </>
  );
}
