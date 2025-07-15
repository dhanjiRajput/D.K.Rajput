import React from 'react'

const WaitingForDriver = (props) => {
  return (
    <div>
      <h1 className='absolute top-7 right-6 font-extrabold text-2xl' onClick={() => props.WaitingForDriver(false)}><i className="ri-arrow-down-wide-line"></i></h1>
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
            <i className="text-lg ri-map-pin-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm -mt-1 text-gray-600'>Kankariya Talav, Ahemdabad</p>
            </div>
          </div>
          
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
    </div>
  )
}

export default WaitingForDriver