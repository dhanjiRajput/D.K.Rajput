import React from 'react'
import { Link } from 'react-router-dom'

const Riding = () => {
  return (
    <div className='h-screen'>
      <Link to="/home" className='fixed h-12 w-12 bg-gray-300 rounded-full top-4 right-4 flex items-center justify-center text-black cursor-pointer'>
        <i className="text-[30px] ri-home-4-fill"></i>
      </Link>
      <div className='h-1/2'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
      </div>
      <div className='h-1/2 p-4'>
        <div className='flex items-center justify-between'>
          <img className='h-20' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
          <div className='text-right'>
            <h2 className='text-lg font-medium'>D.K.Rajput</h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1' >GJ-05 0802</h4>
            <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
          </div>
        </div>
        <div className='flex gap-2 justify-between flex-col items-center'>
          <div className='w-full mt-5'>
            <div className='flex items-center gap-2 p-2 border-b-2 border-gray-200'>
              <i className="ri-stop-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm -mt-1 text-gray-600'>Kankariya Talav, Ahemdabad</p>
              </div>
            </div>

            <div className='flex items-center gap-2 p-2 border-b-2 border-gray-200'>
              <i className="ri-currency-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>Rs. 200</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
        <button className='w-full mt-5 bg-green-700 text-white rounded-full py-2 text-lg font-bold'>Make A Payment</button>
      </div>
    </div>
  )
}

export default Riding