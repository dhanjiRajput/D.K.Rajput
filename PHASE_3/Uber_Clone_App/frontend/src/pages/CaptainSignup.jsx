import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');


  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const newCaptain = {
      email: email,
      password: password,
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        vehicleType: vehicleType,
        capacity: vehicleCapacity
      }

    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, newCaptain);
    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem('token', data.token);
      navigate('/captain-home');
    };

    setEmail('');
    setPassword('');
    setLastName('');
    setFirstName('');
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleType('');
    setVehicleCapacity('');
  };
  return (
    <div className='pl-7 pr-7 pb-7 h-screen flex flex-col justify-between'>
      <div>
        <form onSubmit={onSubmitHandler}>
          <img className='w-40' src="https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png" alt="" />
          <div className="w-full h-px bg-gray-300"></div>
          <h3 className='text-xl font-medium mb-2 mt-5'>What's Your Name</h3>
          <div className='flex gap-4'>
            <input value={firstname} onChange={(e) => setFirstName(e.target.value)} className='bg-[#eeeeee] mb-7 w-1/2 rounded px-4 py-2 border  text-lg placeholder:text-base' type="text" required placeholder='First Name' />
            <input value={lastname} onChange={(e) => setLastName(e.target.value)} className='bg-[#eeeeee] mb-7 w-1/2 rounded px-4 py-2 border  text-lg placeholder:text-base' type="text" required placeholder='Last Name' />
          </div>
          <h3 className='text-xl font-medium mb-2 mt-2'>What's Your email</h3>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' type="email" required placeholder='email@example.com' />
          <h3 className='text-xl font-medium mb-2'>Enter Password</h3>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' type="password" placeholder='password' required />

          <h3 className='text-xl font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4'>
            <input
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              className='bg-[#eeeeee] mb-7 w-1/2 rounded px-4 py-2 border  text-lg placeholder:text-base'
              type="text"
              required
              placeholder='Vehicle Color'
            />
            <input
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              className='bg-[#eeeeee] mb-7 w-1/2 rounded px-4 py-2 border  text-lg placeholder:text-base'
              type="text"
              required
              placeholder='Vehicle Plate'
            />
          </div>
          <div className='flex gap-4'>
            <input
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
              type="number"
              min="1"
              required
              placeholder='Vehicle Capacity'
            />
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
              required
            >
              <option value="" disabled>Select Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <button className='bg-[#111] mb-7 font-semibold text-white rounded px-4 py-2 w-full text-lg placeholder:text-base'>Captain Sign-Up</button>
          <p className='text-center'>Already Have An Account?<Link to='/captain-login' className='text-blue-700'>Click Here.</Link></p>
        </form>
      </div>
      <div>
        <p className='text-[10px]'>
          This is Site is Protected by reCaptcha and the google privacy policy and terms of service Apply.
        </p>
      </div>
    </div>
  )
};

export default CaptainSignup