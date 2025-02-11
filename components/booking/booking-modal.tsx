import React from "react";
import CarCard from "../car/car-card";
import BookingForm from "./booking-form";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function BookingModal({ car, isOpen, onClose }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-11/12 max-w-5xl h-screen overflow-y-scroll md:overflow-hidden md:h-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <CarCard car={car} />
          </div>
          <div>
            <BookingForm car={car} onClose={onClose} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BookingModal;
