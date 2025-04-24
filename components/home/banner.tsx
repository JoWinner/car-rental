import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { cn } from "@/lib/utils"

export default function Banner() {
  return (
    <div className="relative w-full overflow-hidden mt-4 mb-16">
      {/* Full-width background image */}
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[500px]">
        <Image
          src="/more-info-autos/horic-banner.jpg"
          alt="Horic Autos - Need a Car?"
          fill
          className="object-cover object-center rounded-lg"
          priority
        />
      </div>

       {/* Two-sided button positioned at top center */}
       <div className="absolute top-[0.25rem] left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex rounded-full overflow-hidden shadow-lg">
          <Link
            href="/cars/buy"
            className={cn(
              "bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2",
              "transition-all duration-300 flex items-center justify-center font-secondary",
            )}
          >
            Buy Car
          </Link>
          <Link
            href="/cars/rent"
            className={cn(
              "bg-zinc-800 hover:bg-black text-white font-medium px-3 py-2",
              "transition-all duration-300 flex items-center justify-center font-secondary ",
            )}
          >
            Rent Car
          </Link>
        </div>
      </div>
    </div>
  )
}
