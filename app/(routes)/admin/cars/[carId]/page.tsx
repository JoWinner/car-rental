import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { CarForm } from "@/components/admin/car-form";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function CarPage({
  params,
}: {
  params: { carId: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin = await isAdminUser(userId);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const car =
    params.carId === "new"
      ? null
      : await db.car.findUnique({
          where: { id: params.carId },
          include: { images: true },
        });

  if (params.carId !== "new" && !car) {
    redirect("/admin/cars");
  }

  return (
    <>
      <div className="space-y-6">
        <AdminHeader
          title={car ? "Edit Car" : "Add New Car"}
          description={
            car
              ? "Update car details and status."
              : "Add a new car to your fleet."
          }
        />
        <CarForm initialData={car} />
      </div>
    </>
  );
}
