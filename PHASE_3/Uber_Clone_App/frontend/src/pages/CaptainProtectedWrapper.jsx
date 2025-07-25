import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { captain,setCaptain } = useContext(CaptainDataContext);
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/captain-login');
    }
  }, [token]);

  axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.status === 200) {
      const data = response.data;
      setCaptain(data);
      setIsLoading(false);
    }
  }).catch(error => {
    console.error('Error fetching captain profile:', error);
    localStorage.removeItem('token');
    navigate('/captain-login');
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>{children}</>
  )
}

export default CaptainProtectedWrapper