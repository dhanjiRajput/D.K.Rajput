import React, { useRef, useState } from 'react'
import { Link,useLocation } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import FinishRide from '../components/FinishRide'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {

    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const finishRidePanelRef = useRef(null);
    const location=useLocation();
    const rideData=location.state?.ride;

    console.log("CaptainRiding :-",rideData);
    

     useGSAP(function () {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        translateY: '0%',
      })
    } else {
      gsap.to(finishRidePanelRef.current, {
        translateY: '100%',
      })
    }
  }, [finishRidePanel]);

  return (
    <div className='h-screen'>
      <div>
        <img className='w-40 z-1 absolute' src="https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png" alt="" />
        <Link to="/captain-home" className='fixed h-12 w-12 bg-gray-300 rounded-full top-4 right-4 flex items-center justify-center text-black cursor-pointer'>
          <i className="text-[25px] ri-home-4-fill"></i>
        </Link>
      </div>
      <div className='h-4/5'>
        {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" /> */}
        <LiveTracking/>
      </div>
      <div className='h-1/5 p-6 flex items-center justify-between bg-yellow-400 relative' 
        onClick={() => setFinishRidePanel(true)}>
        <h1 className='p-1 text-center w-[90%] absolute top-0'><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h1>
        <h4 className='text-xl font-semibold ml-1'>4.2 Km Away</h4>
        <button className='bg-green-700 text-white rounded-xl py-3 px-7 text-lg font-bold'>Complete Ride</button>
      </div>

      <div ref={finishRidePanelRef} className='fixed z-10 bottom-0  translate-y-full bg-white px-3 py-8 pt-12 w-full'>
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  )
}

export default CaptainRiding