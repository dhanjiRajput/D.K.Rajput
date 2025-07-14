import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
        <h1 className='absolute top-7 right-6 font-extrabold text-2xl' onClick={() => props.setVehiclePanel(false)}><i className="ri-arrow-down-wide-line"></i></h1>
        <h3 className='text-2xl font-semibold mb-5'>Choose Your Vehicle</h3>
        <div onClick={()=>props.setConfirmRidePanel(true)} className='flex mb-2 p-3 border-2  border-gray-50 active:border-black rounded-xl items-center justify-between w-full'>
          <img className='h-10' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
          <div className=' w-1/2'>
            <h4 className='font-medium text-base'>Moto <span><i className="ri-user-fill"></i>1</span></h4>
            <h5 className='font-medium text-sm'>3 mins Away</h5>
            <p className='font-normal text-xs text-gray-500'>Affordable,Motorcycle Rides</p>
          </div>
          <h2 className='text-xl font-semibold'>Rs.156.20</h2>
        </div>

        <div onClick={()=>props.setConfirmRidePanel(true)} className='flex mb-2 p-3 border-2  border-gray-50 active:border-black rounded-xl items-center justify-between w-full'>
          <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="" />
          <div className=' w-1/2'>
            <h4 className='font-medium text-base'>Moto <span><i className="ri-user-fill"></i>1</span></h4>
            <h5 className='font-medium text-sm'>3 mins Away</h5>
            <p className='font-normal text-xs text-gray-500'>Affordable,Motorcycle Rides</p>
          </div>
          <h2 className='text-xl font-semibold'>Rs.56.20</h2>
        </div>

        <div onClick={()=>props.setConfirmRidePanel(true)} className='flex mb-2 p-3 border-2  border-gray-50 active:border-black rounded-xl items-center justify-between w-full'>
          <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="" />
          <div className=' w-1/2'>
            <h4 className='font-medium text-base'>Uber Auto <span><i className="ri-user-fill"></i>3</span></h4>
            <h5 className='font-medium text-sm'>2 mins Away</h5>
            <p className='font-normal text-xs text-gray-500'>Affordable,Auto Rides</p>
          </div>
          <h2 className='text-xl font-semibold'>Rs.120.20</h2>
        </div>
    </div>
  )
}

export default VehiclePanel