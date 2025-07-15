import React from 'react'
import { Link } from 'react-router-dom';

const FinishRide = (props) => {
    return (
        <div>
            <h1 className='absolute top-7 right-6 font-extrabold text-2xl' onClick={() => props.setFinishRidePanel(false)}><i className="ri-arrow-down-wide-line"></i></h1>
            <h3 className='text-2xl font-semibold mb-5'>Finished This Ride!</h3>
            <div className='flex gap-2 justify-between items-center mt-4 p-3 bg-yellow-400 rounded-lg'>
                <div className='flex gap-3 items-center'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://png.pngtree.com/png-clipart/20250501/original/pngtree-a-confident-male-model-with-subtle-charming-png-image_20921424.png" alt="" />
                    <h2 className='text-xl font-medium'>D.K.Rajput</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
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
                <div className='mt-6 w-full'>
                    <Link to="/captain-home"
                        className='w-full flex items-center justify-center mt-5 bg-green-700 text-white rounded-xl py-2 text-lg font-bold'>Finish Ride</Link>
                        <p className='mt-10 text-xs'>Click on finish button if you have completed the payment</p>
                </div>
            </div>
        </div>
    )
}

export default FinishRide