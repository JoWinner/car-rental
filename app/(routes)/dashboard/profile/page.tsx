
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userProfile = await db.userProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!userProfile) {
    return redirect("/");
  }
  return (
    // <DashboardShell>
    <>
      <DashboardHeader
        heading="Profile"
        text="Manage your account."
        />
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileForm initialData={userProfile} />
          </CardContent>
        </Card>
      </div>
        </>
    // </DashboardShell>
  );
}
