import React from "react";
import ModalCarCard from "../car/modal-car-card";
import BookingForm from "./booking-form";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingModalProps {
  car: {
    id: string;
    name: string;
    brand?: string;
    model?: string;
    price: number;
    images?: { url: string }[];
    image?: { url: string };
  };
  isOpen: boolean;
  onClose: () => void;
}

function BookingModal({ car, isOpen, onClose }: BookingModalProps) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p>Please sign in to book a car.</p>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen h-full md:h-auto md:max-h-[85vh] w-full md:max-w-5xl p-0 md:p-6">
        <DialogHeader className="px-4 pt-4 md:px-0 md:pt-0">
          <DialogTitle>Book Your Car</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] md:h-auto">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 p-4 md:p-0">
            <div className="space-y-4">
              <ModalCarCard car={car} />
            </div>
            <div className="overflow-y-scroll h-[400px] px-4">
              <BookingForm car={car} onClose={onClose} />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default BookingModal;
