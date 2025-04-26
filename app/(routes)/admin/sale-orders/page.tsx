import { SaleOrdersClient } from "@/components/admin/sale-orders-client";

export const metadata = {
  title: "Car Rental Admin - Sale Orders",
  description: "View and manage all car sale orders",
};

export default function AdminSaleOrdersPage() {
  return (
    <div className="p-6">
      <SaleOrdersClient />
    </div>
  );
} 