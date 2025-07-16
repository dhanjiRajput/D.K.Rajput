import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import axios from 'axios';
import WaitingForDriver from '../components/WaitingForDriver';

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const panelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const panelRefClose = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)

  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);

    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
            params: { query: value },
            headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        setPickupSuggestions(response.data);
    } catch (error) {
        console.error("Error fetching pickup suggestions:", error);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { query: value }, // ✅ corrected from 'input' to 'query'
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDestinationSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
    }
  };

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: '24px',
        // opacity:1
      })
      gsap.to(panelRefClose.current, {
        opacity: 1,

      })
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        // opacity:0,
      })
      gsap.to(panelRefClose.current, {
        opacity: 0
      })
    }
  }, [panelOpen]);

  useGSAP(function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        translateY: '0%',
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        translateY: '100%',
      })
    }
  }, [vehiclePanel]);

  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        translateY: '0%',
      })
    } else {
      gsap.to(confirmRidePanelRef.current, {
        translateY: '100%',
      })
    }
  }, [confirmRidePanel]);


  useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        translateY: '0%',
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        translateY: '100%',
      })
    }
  }, [vehicleFound]);


  useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(WaitingForDriverRef.current, {
        translateY: '0%',
      })
    } else {
      gsap.to(WaitingForDriverRef.current, {
        translateY: '100%',
      })
    }
  }, [waitingForDriver]);

  function findTrip(){
      setVehiclePanel(true)
      setPanelOpen(false)
  }

  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-40 absolute' src="https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png" alt="" />
      <div className='h-screen w-screen'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
      </div>
      <div className='flex flex-col justify-end absolute h-screen top-0 w-full'>
        <div className='h-[25%] bg-white p-5 rounded-t-xl relative'>
          <h1 ref={panelRefClose} onClick={() => setPanelOpen(false)} className='opacity-0 absolute top-5 right-6 font-extrabold text-2xl'><i className="ri-arrow-down-wide-line"></i></h1>
          <h4 className='text-2xl font-semibold'>Find Your Ride</h4>
          <form onSubmit={onSubmitHandler}>
            <div className='line absolute h-16 w-1 top-[55%] left-10 bg-gray-700 rounded-full'></div>
            <input onClick={() => {
              setPanelOpen(true)
              setActiveField('pickup')
            }} value={pickup} onChange={handlePickupChange} className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5' type="text" placeholder='Pickup Location' />
            <input onClick={() => {
              setPanelOpen(true)
              setActiveField('destination')
            }} value={destination} onChange={handleDestinationChange} className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3' type="text" placeholder='Destination Location' />
          </form>
          
        </div>
        <div ref={panelRef} className='h-0 bg-white'>
          <button onClick={findTrip}
          className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>Find Trip</button>
          <LocationSearchPanel suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField} />
        </div>
      </div>
      <div ref={vehiclePanelRef} className='fixed z-10 bottom-0 translate-y-full bg-white px-3 py-8 pt-12 w-full'>
        <VehiclePanel setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>

      <div ref={confirmRidePanelRef} className='fixed z-10 bottom-0 translate-y-full bg-white px-3 py-8 pt-12 w-full'>
        <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>

      <div ref={vehicleFoundRef} className='fixed z-10 bottom-0 translate-y-full bg-white px-3 py-8 pt-12 w-full'>
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>

      <div ref={WaitingForDriverRef} className='fixed z-10 bottom-0 bg-white px-3 py-8 pt-12 w-full'>
        <WaitingForDriver waitingForDriver={waitingForDriver} setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  )
}

export default Home

