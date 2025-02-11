import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { isAdminUser } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { UserTable } from "@/components/admin/user-table";

export default async function AdminCarsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin = await isAdminUser(userId);

  if (!isAdmin) {
    redirect("/dashboard");
  }

   // Fetch users
   const users = await db.userProfile.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  async function handleViewUser(user: any) {
    "use server";
    // Implement view user details
    // This could redirect to a user details page
  }

  async function handleToggleUserStatus(user: any) {
    "use server";
    await db.userProfile.update({
      where: { id: user.id },
      data: { isActive: !user.isActive },
    });
  }

  return (
    <>
      <AdminHeader
        title=" Manage Users/Customers"
        description="find and manage your customers. You deactivate and activate their account."
      />
       <div>
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              <UserTable
                users={users}
                onView={handleViewUser}
                onToggleStatus={handleToggleUserStatus}
              />
            </div>
    </>
  );
}
