// DashboardLayout.tsx
import { auth } from "@clerk/nextjs/server";
import { userProfile } from "@/lib/user-profile";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { redirectToSignIn, userId } = await auth();
  const isUser = await userProfile(userId);

  if (!isUser) {
    return redirectToSignIn();
  }

  return (
    <DashboardShell>
      <div className="my-10">{children}</div>
    </DashboardShell>
  );
};

export default DashboardLayout;
