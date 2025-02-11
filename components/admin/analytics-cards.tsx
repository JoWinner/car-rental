"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarStatus } from "@prisma/client";
import {
  Car,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AnalyticsCardsProps {
  analytics: any;
  carsStats: any[];
}

export function AnalyticsCards({ analytics, carsStats }: AnalyticsCardsProps) {
  const availableCars =
    carsStats.find((stat) => stat.status === CarStatus.AVAILABLE)?._count
      ._all ?? 0;

  const bookedCars =
    carsStats.find((stat) => stat.status === CarStatus.BOOKED)?._count._all ??
    0;

  const maintenanceCars =
    carsStats.find((stat) => stat.status === CarStatus.MAINTENANCE)?._count
      ._all ?? 0;

  const totalCars = carsStats.reduce((acc, stat) => acc + stat._count._all, 0);
  const utilization = totalCars > 0 ? (bookedCars / totalCars) * 100 : 0;

  const completionRate =
    analytics?.totalBookings > 0
      ? (analytics.completedBookings / analytics.totalBookings) * 100
      : 0;

  const cancellationRate =
    analytics?.totalBookings > 0
      ? (analytics.cancelledBookings / analytics.totalBookings) * 100
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Revenue Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${analytics?.totalRevenue.toFixed(2) ?? "0.00"}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground">
              Average per booking: $
              {analytics?.totalBookings > 0
                ? (analytics.totalRevenue / analytics.totalBookings).toFixed(2)
                : "0.00"}
            </p>
            <Progress value={completionRate} className="h-1" />
            <p className="text-xs text-muted-foreground">
              {completionRate.toFixed(1)}% completion rate
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Users Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.activeUsers ?? 0}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">New this month</span>
              <span className="font-medium text-green-600">+12</span>
            </div>
            <Progress value={75} className="h-1" />
            <p className="text-xs text-muted-foreground">
              75% user retention rate
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Status Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fleet Status</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCars} Cars</div>
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-green-600">{availableCars}</span>{" "}
                Available
              </div>
              <div>
                <span className="text-blue-600">{bookedCars}</span> Booked
              </div>
              <div>
                <span className="text-yellow-600">{maintenanceCars}</span>{" "}
                Maintenance
              </div>
              <div>
                <span className="text-muted-foreground">
                  {utilization.toFixed(1)}%
                </span>{" "}
                Utilization
              </div>
            </div>
            <Progress value={utilization} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Bookings Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Bookings Overview
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.totalBookings ?? 0} Total
          </div>
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-green-600">
                  {analytics?.completedBookings ?? 0}
                </span>{" "}
                Completed
              </div>
              <div>
                <span className="text-red-600">
                  {analytics?.cancelledBookings ?? 0}
                </span>{" "}
                Cancelled
              </div>
            </div>
            <Progress value={100 - cancellationRate} className="h-1" />
            <p className="text-xs text-muted-foreground">
              {cancellationRate.toFixed(1)}% cancellation rate
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
