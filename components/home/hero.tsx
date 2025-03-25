import Image from 'next/image'
import Link from 'next/link'

function Hero() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 font-secondary py-6 md:py-10'>
      <div className="space-y-4 md:space-y-6">        
        <h2 className='text-3xl md:text-[60px] font-bold leading-tight'>
          Rent<span className='text-blue-600 mx-4'>Premium Cars</span>Everywhere
        </h2>
        <h2 className='text-base md:text-[20px] text-gray-500 pr-4 md:pr-20 font-primary'>
          Book the selected car effortlessly, Pay for driving only, Book the Car Now
        </h2>
        <Link href='/cars'>
          <button className='px-6 py-3 mt-4 bg-primary text-white rounded-full hover:scale-105 transition-all font-bold font-secondary text-base sm:text-lg'>
            Explore Cars
          </button>
        </Link>
      </div>
      <div className="mt-6 md:mt-0">
        <Image 
          src='/hero.png'
          alt='hero'
          width={400}
          height={500}
          className='w-full object-cover align-middle'
        />
      </div>
    </div>
  )
}

export default Hero