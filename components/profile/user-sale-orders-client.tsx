"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { Car, SaleOrderStatus } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SaleOrderType {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: SaleOrderStatus;
  createdAt: string;
  car: Car & {
    images: { url: string }[];
  };
}

export function UserSaleOrdersClient() {
  const [orders, setOrders] = useState<SaleOrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/shop/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load sale orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: SaleOrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusDescription = (status: SaleOrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Your order is pending review";
      case "PROCESSING":
        return "Your order is being processed";
      case "COMPLETED":
        return "Your order has been completed";
      case "CANCELLED":
        return "Your order has been cancelled";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Sale Orders</CardTitle>
          <CardDescription>Track your car purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <p className="text-muted-foreground">You haven't placed any orders yet</p>
            <Link href="/shop">
              <Button>Browse Cars For Sale</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Sale Orders</CardTitle>
        <CardDescription>Track your car purchase orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden">
                      <Image
                        src={order.car.images[0]?.url || "/placeholder-car.png"}
                        alt={order.car.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{order.car.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.car.brand} {order.car.model}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {getStatusDescription(order.status)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {formatPrice(order.car.salePrice || 0)}
                  </p>
                </TableCell>
                <TableCell>
                  <Link href={`/shop/${order.car.id}`}>
                    <Button variant="outline" size="sm">
                      View Car
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 