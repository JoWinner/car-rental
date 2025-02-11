"use client";

import { CarForm } from "@/components/admin/car-form";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewCarPage() {
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create car");
      }

      router.push("/admin/cars");
      router.refresh();
    } catch (error) {
      console.error("Error creating car:", error);
      toast.error("Error", {
        description: "Failed to create car.",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <AdminHeader
          title="Add New Car"
          description="Add and edit your car fleet."
        />
        <CarForm onSubmit={onSubmit} />
      </div>
    </>
  );
}
