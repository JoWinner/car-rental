"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createBooking } from "@/services/booking";
import { Card, CardContent } from "@/components/ui/card";
import { differenceInDays } from "date-fns";

// Form validation schema
const formSchema = z.object({
  location: z.string().min(1, "Location is required"),
  pickUpDate: z.string().min(1, "Pick up date is required"),
  dropOffDate: z.string().min(1, "Drop off date is required"),
  pickUpTime: z.string().min(1, "Pick up time is required"),
  dropOffTime: z.string().min(1, "Drop off time is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  carId: z.string(),
});

const STORE_LOCATIONS = [
  { address: "123 Main St, New York, NY 10001" },
  { address: "456 Park Ave, Los Angeles, CA 90001" },
  { address: "789 Market St, San Francisco, CA 94101" },
];

function BookingForm({ car, onClose }: { car: any; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const today = new Date();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      pickUpDate: "",
      dropOffDate: "",
      pickUpTime: "",
      dropOffTime: "",
      contactNumber: "",
      carId: car?.id || "",
    },
  });

  // Calculate total cost whenever dates change
  useEffect(() => {
    const pickUpDate = form.watch("pickUpDate");
    const dropOffDate = form.watch("dropOffDate");

    if (pickUpDate && dropOffDate) {
      const start = new Date(pickUpDate);
      const end = new Date(dropOffDate);
      const days = Math.max(differenceInDays(end, start), 1);
      setTotalCost(days * car.price);
    } else {
      setTotalCost(0);
    }
  }, [form.watch("pickUpDate"), form.watch("dropOffDate"), car.price]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      // Convert dates and times to Date objects
      const pickUpDateTime = new Date(
        `${values.pickUpDate}T${values.pickUpTime}`
      );
      const dropOffDateTime = new Date(
        `${values.dropOffDate}T${values.dropOffTime}`
      );

      // Validate dates
      if (pickUpDateTime >= dropOffDateTime) {
        toast.error("Invalid dates", {
          description: "Drop-off date must be after pick-up date",
        });
        return;
      }

      // Check if dates are in the past
      if (pickUpDateTime < new Date()) {
        toast.error("Invalid dates", {
          description: "Pick-up date cannot be in the past",
        });
        return;
      }

      // Calculate total price based on days
      const days = Math.ceil(
        (dropOffDateTime.getTime() - pickUpDateTime.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (days < 1) {
        toast.error("Invalid booking duration", {
          description: "Minimum booking duration is 1 day",
        });
        return;
      }

      const totalPrice = days * car.price;

      const bookingData = {
        carId: values.carId,
        startDate: pickUpDateTime.toISOString(),
        endDate: dropOffDateTime.toISOString(),
        totalPrice,
        location: values.location,
        notes: `Contact: ${values.contactNumber}\nPickup Location: ${values.location}`,
      };

      const booking = {
        ...bookingData,
        startDate: new Date(bookingData.startDate),
        endDate: new Date(bookingData.endDate),
      };

      await createBooking(booking);

      toast.success("Booking Created Successfully!", {
        description: "Your car has been booked.",
      });
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6"
      >
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500">Pickup Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {STORE_LOCATIONS.map((loc, index) => (
                    <SelectItem key={index} value={loc.address}>
                      {loc.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickUpDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Pick Up Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={today.toISOString().split("T")[0]}
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dropOffDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Drop Off Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={
                      form.watch("pickUpDate") ||
                      today.toISOString().split("T")[0]
                    }
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickUpTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Pick Up Time</FormLabel>
                <FormControl>
                  <Input type="time" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dropOffTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Drop Off Time</FormLabel>
                <FormControl>
                  <Input type="time" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500">Contact Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your contact number"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {totalCost > 0 && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Daily Rate:</span>
                  <span>${car.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Number of Days:</span>
                  <span>
                    {Math.max(
                      differenceInDays(
                        new Date(form.watch("dropOffDate")),
                        new Date(form.watch("pickUpDate"))
                      ),
                      1
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>Total Cost:</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Booking..." : "Book Now"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default BookingForm;
