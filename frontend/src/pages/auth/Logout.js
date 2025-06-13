import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.iocontainerapps.io/api/logout/`, {}, {
      withCredentials: true
    }).then(() => {
      alert('Logged out.');
      navigate('/login');
    }).catch(err => {
      console.error("Logout failed", err);
    });
  }, [navigate]);

  return null; // no visible component
};

export default Logout;
