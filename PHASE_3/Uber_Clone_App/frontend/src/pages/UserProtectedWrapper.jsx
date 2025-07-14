import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const UserProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status === 200) {
          setUser(response.data); 
          setIsLoading(false);
        }
      }).catch(error => {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [token, navigate, setUser]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>{children}</>
  )
}

export default UserProtectedWrapper