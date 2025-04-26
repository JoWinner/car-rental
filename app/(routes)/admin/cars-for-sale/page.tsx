import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { CarsForSaleTable } from "@/components/admin/cars-for-sale-table";

export default async function AdminCarsForSalePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin = await isAdminUser(userId);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch cars placed on sale
  const carsForSale = await db.car.findMany({
    include: {
      images: true,
    },
    where: {
      onSale: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <AdminHeader
        title="Cars For Sale"
        description="Manage your cars that are placed on sale."
        action={{
          label: "Add car for sale",
          href: "/admin/cars/new",
        }}
      />
      <div>
        <h2 className="text-2xl font-bold mb-4">Cars Currently On Sale</h2>
        <CarsForSaleTable cars={carsForSale} />
      </div>
    </>
  );
}
