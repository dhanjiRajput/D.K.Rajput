import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopup from '../components/ConfirmRidePopup'

const CaptainHome = () => {
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ridePopupPanel, setRidePopupPanel] = useState(true);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  useGSAP(function () {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        translateY: '0%',
      })
    } else {
      gsap.to(ridePopupPanelRef.current, {
        translateY: '100%',
      })
    }
  }, [ridePopupPanel]);

  useGSAP(function () {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
        translateY: '0%',
      })
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        translateY: '100%',
      })
    }
  }, [confirmRidePopupPanel]);

  return (
    <div className='h-screen'>
      <div>
        <img className='w-40 absolute' src="https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png" alt="" />
        <Link to="/captain/logout" className='fixed h-12 w-12 bg-gray-300 rounded-full top-4 right-4 flex items-center justify-center text-black cursor-pointer'>
          <i className="text-[25px] ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className='h-3/5'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
      </div>
      <div className='h-2/5 p-6'>
        <CaptainDetails/>
      </div>
      <div ref={ridePopupPanelRef} className='fixed z-10 bottom-0 translate-y-full bg-white px-3 py-8 pt-12 w-full'>
        <RidePopUp setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel}/>
      </div>

      <div ref={confirmRidePopupPanelRef} className='fixed z-10 bottom-0  translate-y-full bg-white px-3 py-8 pt-12 w-full'>
        <ConfirmRidePopup setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
      </div>
    </div>
  )
}

export default CaptainHome