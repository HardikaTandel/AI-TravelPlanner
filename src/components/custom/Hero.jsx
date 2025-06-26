import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (

 <div className="relative w-full h-screen">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover filter blur-sm brightness-75"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1673240367277-e1d394465b56?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW91bnRhaW58ZW58MHx8MHx8fDA%3D')`,
        }}
      ></div>

    <div className='flex flex-col items-center mx-56 gap-9 z-10 relative mt-4'>
        <h1 className='font-extrabold text-[40px] text-center mt-16'><span className='text-gray-800'>Discover Your Next Adventure with AI:  </span>
              Personalized Itineraries at your Fingertips
        </h1>
        <p className='text-xl text-blue-900 text-center'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p>
        
        <Link to={'/create-trip'}>
        <Button className='text-white bg-black py-6 px-10'>Get Started</Button>
        </Link>
    </div>
    </div>
  )
}

export default Hero;