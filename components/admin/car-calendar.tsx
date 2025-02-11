"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingStatus, type Car } from "@prisma/client";
import { addDays, isWithinInterval } from "date-fns";
import { formatDate } from "@/lib/utils";

interface CarCalendarProps {
  cars: Car[];
  bookings: any[];
}

export function CarCalendar({ cars, bookings }: CarCalendarProps) {
  const [selectedCar, setSelectedCar] = useState<string | undefined>();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter bookings for selected car
  const carBookings = selectedCar
    ? bookings.filter(
        (booking) =>
          booking.carId === selectedCar &&
          booking.status !== BookingStatus.CANCELLED
      )
    : [];

  // Create an array of disabled dates based on bookings
  const disabledDates = carBookings.flatMap((booking) => {
    const dates = [];
    let currentDate = new Date(booking.startDate);
    while (currentDate <= new Date(booking.endDate)) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    return dates;
  });

  // Get booking details for a specific date
  const getBookingForDate = (date: Date) => {
    return carBookings.find((booking) =>
      isWithinInterval(date, {
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Car Availability Calendar</CardTitle>
        <CardDescription>View and manage car bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Select
              value={selectedCar}
              onValueChange={(value) => setSelectedCar(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a car" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDates}
              modifiers={{
                booked: disabledDates,
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "rgb(254, 226, 226)",
                  color: "rgb(185, 28, 28)",
                },
              }}
              className="mt-4"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Booking Details</h3>
            {date && selectedCar && (
              <>
                <p className="text-sm text-muted-foreground">
                  Selected date: {formatDate(date)}
                </p>
                {getBookingForDate(date) ? (
                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Booked</p>
                    <div className="mt-2 space-y-2 text-sm">
                      <p>
                        Customer:{" "}
                        {getBookingForDate(date)?.user?.name || "Unknown"}
                      </p>
                      <p>
                        From:{" "}
                        {formatDate(
                          new Date(getBookingForDate(date)?.startDate)
                        )}
                      </p>
                      <p>
                        To:{" "}
                        {formatDate(new Date(getBookingForDate(date)?.endDate))}
                      </p>
                      <p>
                        Status:{" "}
                        <span className="capitalize">
                          {getBookingForDate(date)?.status.toLowerCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border p-4 text-green-600 bg-green-50">
                    Available on this date
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
