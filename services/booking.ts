import { BookingStatus, PaymentStatus } from "@prisma/client";

interface CreateBookingData {
  carId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  notes?: string;
}

export async function createBooking(data: CreateBookingData) {
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create booking");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createBooking:", error);
    throw error;
  }
}

export async function getUserBookings() {
  try {
    const response = await fetch("/api/bookings");
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    throw error;
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  try {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    throw error;
  }
}

export async function updatePaymentStatus(
  bookingId: string,
  paymentStatus: PaymentStatus,
  paymentId?: string
) {
  try {
    const response = await fetch(`/api/bookings/${bookingId}/payment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentStatus, paymentId }),
    });

    if (!response.ok) {
      throw new Error("Failed to update payment status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    throw error;
  }
}
