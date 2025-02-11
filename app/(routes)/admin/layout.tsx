// DashboardLayout.tsx
import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/user-profile";
import { AdminShell } from "@/components/admin/admin-shell";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { redirectToSignIn, userId } = await auth();
  const isAdmin = await isAdminUser(userId);

  if (!isAdmin) {
    return redirectToSignIn();
  }

  return (
      <AdminShell>
          <div>
            {children}
          </div>
       </AdminShell>

  );
}

export default DashboardLayout;