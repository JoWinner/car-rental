import Image from "next/image";
import React from "react";
import { FaGasPump } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { PiSteeringWheelFill } from "react-icons/pi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingModal from "@/components/booking/booking-modal";
import Link from "next/link";

interface CarCardProps {
  car: {
    id: string;
    name: string;
    price: number;
    brand?: string;
    model?: string;
    images?: { url: string }[];
    image?: { url: string };
    carType?: string;
    category?: string;
    seat?: number;
    seats?: number;
    carAvg?: number;
    mpg?: number;
  };
}

function CarCard({ car }: CarCardProps) {
  const [showBookingModal, setShowBookingModal] = React.useState(false);

  const imageUrl = car?.images?.[0]?.url || car?.image?.url || "/placeholder-car.jpg";
  const carType = car?.carType || car?.category || "N/A";
  const seatCount = car?.seat || car?.seats || "N/A";
  const mpg = car?.carAvg || car?.mpg || "N/A";

  return (
    <>
      <Card className="group bg-gray-50 hover:bg-background hover:border-red-500 cursor-pointer transition-all duration-500 m-1 sm:m-5 font-secondary">
        <CardHeader className="p-3 sm:p-5">
          <CardTitle className="space-y-2">
            <h2 className="text-lg sm:text-xl font-medium">{car.name}</h2>
            <h2 className="text-2xl sm:text-3xl font-bold">
              <span className="text-xl sm:text-2xl font-light">$</span>
              {car.price}
              <span className="text-xs sm:text-sm font-light"> /day</span>
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-8 pt-0">
          <div className="flex justify-center">
            <Link href={`/cars/${car.id}`}>
              <Image
                src={imageUrl}
                alt={car.name}
                width={220}
                height={200}
                className="w-[280px] h-[180px] sm:w-[250px] sm:h-[150px] mb-3 object-contain"
              />
            </Link>
          </div>
          <div className="flex justify-around group-hover:hidden font-primary">
            <div className="text-center text-gray-500">
              <PiSteeringWheelFill className="w-full text-xl sm:text-2xl mb-2" />
              <h2 className="text-sm sm:text-base font-light">{carType}</h2>
            </div>
            <div className="text-center text-gray-500">
              <MdAirlineSeatReclineNormal className="w-full text-xl sm:text-2xl mb-2" />
              <h2 className="text-sm sm:text-base font-light">{seatCount} Seat</h2>
            </div>
            <div className="text-center text-gray-500">
              <FaGasPump className="w-full text-xl sm:text-2xl mb-2" />
              <h2 className="text-sm sm:text-base font-light">{mpg} MPG</h2>
            </div>
          </div>

          <button
            onClick={() => setShowBookingModal(true)}
            className="hidden group-hover:flex bg-gradient-to-r from-red-400 to-red-700 rounded-lg text-white w-full px-4 py-3 mt-3 justify-between text-base sm:text-lg"
          >
            Rent Now
            <span className="bg-red-400 p-1 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
        </CardContent>
      </Card>

      <BookingModal
        car={car}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </>
  );
}

export default CarCard;