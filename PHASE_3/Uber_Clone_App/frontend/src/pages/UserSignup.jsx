import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password,
      fullname: {
        firstname: firstname,
        lastname: lastname,
      }
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
    if (response.status === 201) {
      const data=response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }

    setEmail('');
    setPassword('');
    setLastName('');
    setFirstName('');
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
          <button className='bg-[#111] mb-7 font-semibold text-white rounded px-4 py-2 w-full text-lg placeholder:text-base'>User Sign-Up</button>
          <p className='text-center'>Already Have An Account?<Link to='/login' className='text-blue-700'>Click Here.</Link></p>
        </form>
      </div>
      <div>
        <p className='text-[10px]'>
          This is Site is Protected by reCaptcha and the google privacy policy and terms of service Apply.
        </p>
      </div>
    </div>
  )
}

export default UserSignup