import React from 'react'

const ConfirmRide = () => {
  return (
    <div>
        <h1 className='absolute top-7 right-6 font-extrabold text-2xl' onClick={() => props.setVehiclePanel(false)}><i className="ri-arrow-down-wide-line"></i></h1>
        <h3 className='text-2xl font-semibold mb-5'>Confirm Your Ride</h3>
        <div className='flex gap-2 justify-between flex-col items-center'>
            <img src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
            <div className='w-full'>
                <div>
                    <i className="ri-map-pin-fill"></i>
                    <div>562</div>
                </div>
                <div></div>
                <div></div>
            </div>
            <button className='w-full bg-green-700 text-white rounded-full py-2 text-lg font-bold'>Confirm</button>
        </div>
    </div>
  )
}

export default ConfirmRide