import { UserSaleOrdersClient } from "@/components/profile/user-sale-orders-client";

export const metadata = {
  title: "My Sale Orders",
  description: "View your car sale orders",
};

export default function UserSaleOrdersPage() {
  return (
    <div className="p-6">
      <UserSaleOrdersClient />
    </div>
  );
} 