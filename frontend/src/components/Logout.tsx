import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { logout, removeToken } from '../services/authServices';

const Logout: React.FC = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const logUserOut = async () => {
      try {
        const response = await logout();

        if (response && response.message === 'Logged out successfully') {
          removeToken()

        //   toast.success('You have logged out successfully!');

          navigate('/login');
        } 
        else {
          toast.error('Logout failed! Please try again.');
        }
      } catch (error) {
        toast.error('An error occurred during logout. Please try again.');
      }
    };

    logUserOut();
  }, [navigate]);

  return (
    <div>
      <h2>Logging you out...</h2>
    </div>
  );
};

export default Logout;
