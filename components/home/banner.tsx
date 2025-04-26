import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { cn } from "@/lib/utils"

export default function Banner() {
  return (
    <div className="relative w-full overflow-hidden mt-16 mb-16">
        <div className=" w-full inset-0 flex items-start justify-center my-8">
        <div className="flex rounded-full overflow-hidden shadow-lg">
          <Link
            href="/shop"
            className={cn(
              "bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2",
              "transition-all duration-300 flex items-center justify-center font-secondary",
            )}
          >
            Buy Car
          </Link>
          <Link
            href="/rent"
            className={cn(
              "bg-zinc-800 hover:bg-black text-white font-medium px-3 py-2",
              "transition-all duration-300 flex items-center justify-center font-secondary",
            )}
          >
            Rent Car
          </Link>
        </div>
      </div>
      {/* Full-width background image */}
      <div className="hidden md:block relative w-full h-[300px] sm:h-[350px] md:h-[500px]">
        <Image
          src="/more-info-autos/horic-banner.jpg"
          alt="Horic Autos - Need a Car?"
          fill
          className="object-cover object-center rounded-xl"
          priority
        />
      </div>
      <div className="relative w-full md:hidden">
        <Image
          src="/more-info-autos/horic-banner.jpg"
          alt="Horic Autos - Need a Car?"
          width={800} // or the natural width of the image
          height={500} // match the ratio (not forced!)
          className="w-full h-auto object-cover object-center rounded-xl"
          priority
        />
      </div>

       {/* Two-sided button positioned at top center */}
       {/* <div className="absolute w-full inset-0 flex items-start justify-center top-[1rem]  md:top-[0.25rem] left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex rounded-full overflow-hidden shadow-lg">
          <Link
            href="/shop"
            className={cn(
              "bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2",
              "transition-all duration-300 flex items-center justify-center font-secondary",
            )}
          >
            Buy Car
          </Link>
          <Link
            href="/rent"
            className={cn(
              "bg-zinc-800 hover:bg-black text-white font-medium px-3 py-2",
              "transition-all duration-300 flex items-center justify-center font-secondary",
            )}
          >
            Rent Car
          </Link>
        </div>
      </div> */}
    </div>
  )
}
