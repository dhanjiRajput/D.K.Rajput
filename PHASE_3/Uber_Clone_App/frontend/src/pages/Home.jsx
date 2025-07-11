import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='bg-cover bg-[url(https://images.unsplash.com/photo-1554672408-730436b60dde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dWJlcnxlbnwwfHwwfHx8MA%3D%3D)] h-screen pt-8 w-full flex justify-between flex-col bg-red-200'>
            <img className='w-40 ml-3' src="https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png" alt="" />
            <div className='bg-white pb-7 py-4 px-4'>
                <h2 className='text-3xl font-bold'>Get Started With Uber</h2>
                <Link to='/login' className='w-full flex items-center justify-center bg-black text-white py-3 rounded mt-5'>Continue</Link>
            </div>
        </div>
    </div>
  )
}

export default Home