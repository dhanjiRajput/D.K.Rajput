import React from 'react'

const LookingForDriver = (props) => {
  return (
    <div>
      <h1 className='absolute top-7 right-6 font-extrabold text-2xl' onClick={() => props.setVehicleFound(false)}><i className="ri-arrow-down-wide-line"></i></h1>
      <h3 className='text-2xl font-semibold mb-5'>Looking For A Driver..</h3>
      <div className='flex gap-2 justify-between flex-col items-center'>
        <img className='h-30 w-30' src="https://media.tenor.com/Z6sMOpVRG78AAAAj/searching-loading.gif" alt="" />
        <div className='w-full mt-5'> 
          <div className='flex items-center gap-2 p-2 border-b-2 border-gray-200'>
            <i className="text-lg ri-map-pin-fill"></i>
            <div>
              {/* <h3 className='text-lg font-medium'>562/11-A</h3> */}
              <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
            </div>
          </div>
          
          <div className='flex items-center gap-2 p-2 border-b-2 border-gray-200'>
            <i className="ri-stop-fill"></i>
            <div>
              {/* <h3 className='text-lg font-medium'>562/11-A</h3> */}
              <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
            </div>
          </div>

          <div className='flex items-center gap-2 p-2 border-b-2 border-gray-200'>
            <i className="ri-currency-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Rs. {props.fare[props.vehicleType]}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LookingForDriver