import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ConfirmRidePopup = (props) => {
    const navigate=useNavigate();
    const [otp, setOtp] = React.useState('');

    const onSubmitHandler = async(e) => {
        e.preventDefault();
        const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`,{
            params:{rideId:props.ride._id,
            otp:otp},
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })

        if(response.status===200){
            props.setConfirmRidePopupPanel(false);
            props.setRidePopupPanel(false);
            navigate('/captain-riding',{state:{ride:props.ride}});
        }
    }
    return (
        <div>
            <h1 className='absolute top-7 right-6 font-extrabold text-2xl' onClick={() => props.setConfirmRidePopupPanel(false)}><i className="ri-arrow-down-wide-line"></i></h1>
            <h3 className='text-2xl font-semibold mb-5'>Confirm This Ride to Start!</h3>
            <div className='flex gap-2 justify-between items-center mt-4 p-3 bg-yellow-400 rounded-lg'>
                <div className='flex gap-3 items-center'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://png.pngtree.com/png-clipart/20250501/original/pngtree-a-confident-male-model-with-subtle-charming-png-image_20921424.png" alt="" />
                    <h2 className='text-xl font-medium capitalize'>{props.ride?.user.fullname.firstname+" "+props.ride?.user.fullname.lastname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-2 p-2 border-b-2 border-gray-200'>
                        <i className="text-lg ri-map-pin-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 p-2 border-b-2 border-gray-200'>
                        <i className="ri-stop-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 p-2 border-b-2 border-gray-200'>
                        <i className="ri-currency-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Rs. {props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>
                </div>
                {/* OTP Section */}

                <div className='mt-6 w-full'>
                    <form onSubmit={onSubmitHandler}>
                        <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" placeholder='Enter OTP' className='w-full border-b-2 border-gray-200 py-2 outline-none' />
                        <button
                            className='w-full mt-2 bg-green-700 text-white rounded-xl py-2 text-lg font-bold'>Confirm</button>
                        <button onClick={() => { props.setConfirmRidePopupPanel(false); props.setRidePopupPanel(false) }}
                            className='w-full mt-2 bg-red-500 text-white rounded-xl py-2 text-lg font-bold'>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopup