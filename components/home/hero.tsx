"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const heroInfoData = [
  {
    id: 1,
    title: "Your Destination for Luxury Vehicles",
    description:
      "Explore an exclusive collection of high-end cars ready for purchase — performance, prestige, and style, all in one place.",
    image: "/more-info-autos/01.png",
    alt: "Luxury Rolls Royce",
  },
  {
    id: 2,
    title: "Unleash Unrivaled Performance",
    description: "Own the world's most powerful and exhilarating supercars — engineered for those who demand the best.",
    image: "/more-info-autos/02-interior.png",
    alt: "Ferrari Supercar",
  },
  {
    id: 3,
    title: "Elevate Every Drive",
    description: "Premium sedans that blend cutting-edge innovation with classic luxury — ideal for business or personal excellence.",
    image: "/more-info-autos/03.png",
    alt: "Mercedes S-Class",
  },
  {
    id: 4,
    title: "Luxury Meets Adventure",
    description: "Discover elite SUVs offering supreme comfort, off-road capability, and executive-level design — now available for you.",
    image: "/more-info-autos/04-interior.jpg",
    alt: "Range Rover",
  },
  {
    id: 5,
    title: "Celebrate Milestones with Timeless Cars",
    description:
      "Mark special occasions with elegance — choose from our selection of classic luxury cars designed to make lasting memories.",
    image: "/more-info-autos/05.png",
    alt: "Classic Bentley",
  },
  {
    id: 6,
    title: "Collect, Cruise, or Showcase",
    description:
      "Discover rare vintage and classic models perfect for collectors, exhibitions, or a stylish Sunday drive.",
    image: "/more-info-autos/06.png",
    alt: "Classic Bentley",
  },
  
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroInfoData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main circles */}
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border-2 border-red-500/10"></div>
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full border-2 border-red-500/20"></div>
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border-2 border-red-500/30"></div>

        {/* Additional contrasting elements */}
        <div className="absolute top-[10%] right-[10%] w-32 h-32 rounded-full bg-red-500/5 backdrop-blur-sm"></div>
        <div className="absolute bottom-[15%] left-[5%] w-24 h-24 rounded-full bg-zinc-900/5"></div>
        <div className="absolute top-[20%] left-[15%] w-16 h-16 rounded-full bg-red-500/10"></div>

        {/* Geometric shapes */}
        <div className="absolute top-[30%] right-[20%] w-40 h-1 bg-zinc-900/10 rotate-45"></div>
        <div className="absolute bottom-[25%] right-[30%] w-40 h-1 bg-red-500/20 -rotate-45"></div>
        <div className="absolute top-[70%] left-[25%] w-20 h-20 border-2 border-zinc-900/10 rotate-12"></div>

        {/* Dots pattern */}
        <div className="absolute top-[15%] left-[40%] grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-red-500/30"
            ></div>
          ))}
        </div>
        <div className="absolute bottom-[20%] right-[15%] grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-zinc-900/20"
            ></div>
          ))}
        </div>
      </div>

      {/* Red accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col-reverse md:flex-row items-center">
          {/* Text content */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0 text-center md:text-left">
            {/* Red accent line */}
            <div className="hidden md:block w-20 h-1 bg-red-500 mb-6"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-secondary text-red-500 leading-tight">
                  {heroInfoData[currentIndex].title}
                </h1>
                <p className="text-zinc-600 text-base sm:text-lg md:text-xl max-w-md mx-auto md:mx-0">
                  {heroInfoData[currentIndex].description}
                </p>

                {/* Contrasting element under text */}
                <div className="w-16 h-1 bg-zinc-900/30 mx-auto md:mx-0"></div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/shop">
                    <button className="px-6 py-3 mt-4 bg-primary text-white rounded-full hover:scale-105 transition-all font-bold font-secondary text-base sm:text-lg">
                      Explore Cars
                    </button>
                  </Link>
                
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Car image */}
          <div className="w-full md:w-1/2 relative">
            {/* Contrasting frame around image */}
            <div className="absolute inset-0 -m-4 rounded-full border-2 border-dashed border-red-500/20 animate-[spin_60s_linear_infinite]"></div>

            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex justify-center items-center"
                >
                  <div className="relative w-full h-full">
                    {/* Enhanced gradient behind car */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-gradient-to-br from-red-500/20 via-zinc-900/5 to-transparent blur-xl"></div>

                    {/* Car image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-[90%] h-[90%]">
                        <Image
                          src={
                            heroInfoData[currentIndex].image ||
                            "/placeholder.svg"
                          }
                          alt={heroInfoData[currentIndex].alt}
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>

                    {/* Accent elements around car */}
                    <div className="absolute top-[10%] right-[10%] w-8 h-8 rounded-full border-2 border-red-500/40"></div>
                    <div className="absolute bottom-[15%] left-[15%] w-6 h-6 rounded-full bg-zinc-900/10"></div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel indicators with enhanced contrast */}
      <div className="relative z-10 flex justify-center pb-8 mt-4">
        <div className="flex space-x-3 p-2 rounded-full bg-white shadow-md">
          {heroInfoData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-10 bg-red-500"
                  : "w-2.5 bg-zinc-900/20 hover:bg-zinc-900/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900/20 via-red-500/30 to-zinc-900/20"></div>
    </div>
  );
}
