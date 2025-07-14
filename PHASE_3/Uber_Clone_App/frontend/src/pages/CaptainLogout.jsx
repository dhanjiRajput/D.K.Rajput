import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptainLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const token = localStorage.getItem('token');
      try {
        if (token) {
          await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch (error) {
        // Optionally handle/log error
      } finally {
        localStorage.removeItem('token');
        navigate('/captain-login');
      }
    };
    logout();
  }, [navigate]);

  return <div>UserLogout</div>;
};

export default CaptainLogout;