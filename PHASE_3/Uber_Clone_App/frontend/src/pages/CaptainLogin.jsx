import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captainData, setCaptainData] = useState({});

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setCaptainData({ email: email, password: password });
    setEmail('');
    setPassword('');
  };
  return (
    <div className='pl-7 pr-7 pb-7 h-screen flex flex-col justify-between'>
      <div>
        <form onSubmit={onSubmitHandler}>
          <img className='w-40' src="https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png" alt="" />
          <div className="w-full h-px bg-gray-300"></div>
          <h3 className='text-xl font-medium mb-2 mt-5'>What's Your email</h3>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' type="email" required placeholder='email@example.com' />
          <h3 className='text-xl font-medium mb-2'>Enter Password</h3>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' type="password" placeholder='password' required />
          <button className='bg-[#111] mb-7 font-semibold text-white rounded px-4 py-2 w-full text-lg placeholder:text-base'>Login</button>
          <p className='text-center'>New Here?<Link to='/captain-signup' className='text-blue-700'>Create New Account</Link></p>
        </form>
      </div>
      <div>
        <Link to='/login' className='bg-[#10b461] mb-7 flex items-center justify-center mt-5 font-semibold text-white rounded px-4 py-2 w-full text-lg placeholder:text-base'>Sign-In As User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin