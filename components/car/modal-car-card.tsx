import Image from "next/image";
import Link from "next/link";
import { FaGasPump } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { PiSteeringWheelFill } from "react-icons/pi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils"

interface CarCardProps {
  car: {
    id: string;
    name: string;
    rentPrice: number;
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

function ModalCarCard({ car }: CarCardProps) {

  // Get the image URL from either data structure
  const imageUrl =
    car?.images?.[0]?.url || car?.image?.url || "/placeholder-car.jpg";

  // Get the car type from either data structure
  const carType = car?.carType || car?.category || "N/A";

  // Get the seat count from either data structure
  const seatCount = car?.seat || car?.seats || "N/A";

  // Get the MPG from either data structure
  const mpg = car?.carAvg || car?.mpg || "N/A";

  return (
    <>
      <Card className="group bg-gray-50 hover:bg-background hover:border-red-500 cursor-pointer transition-all duration-500 m-1 sm:m-5 font-secondary">
        <CardHeader className="p-2 sm:p-5">
          <CardTitle className="space-y-2">
            <h2 className="text-[20px] font-medium text-primary ">{car.name}</h2>
            <h2 className="text-[28px] font-bold">
              {formatPrice(car.rentPrice)}
              <span className="text-[12px] font-light"> /day</span>
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <div className="flex justify-center rounded-lg">
            <Link href={`/cars/${car.id}`} className="rounded-lg">
              <Image
                src={imageUrl}
                alt={car.name}
                width={220}
                height={200}
                className="w-[300px] h-[200px] mb-3 object-contain"
              />
            </Link>
          </div>
          <div className="flex justify-around group-hover:hidden font-primary">
            <div className="text-center text-gray-500">
              <PiSteeringWheelFill className="w-full text-[22px] mb-2" />
              <h2 className="line-clamp-5 text-[14px] font-light">{carType.replace(/_/g, " ")}</h2>
            </div>
            <div className="text-center text-gray-500">
              <MdAirlineSeatReclineNormal className="w-full text-[22px] mb-2" />
              <h2 className="line-clamp-5 text-[14px] font-light">
                {seatCount} Seats
              </h2>
            </div>
            <div className="text-center text-gray-500">
              <FaGasPump className="w-full text-[22px] mb-2" />
              <h2 className="line-clamp-5 text-[14px] font-light">{mpg} MPG</h2>
            </div>
          </div>

        
            <Link
              href={`/cars/${car.id}`}
              className="hidden group-hover:flex bg-gradient-to-r from-red-400 to-red-700 rounded-lg text-white w-full px-5 py-2 mt-2 justify-between"
            >
             More Details
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
            </Link>
        </CardContent>
      </Card>

    </>
  );
}

export default ModalCarCard;
