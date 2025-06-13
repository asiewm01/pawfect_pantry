// src/components/AppInit.js
import { useEffect } from 'react';
import axios from '../axiosSetup';

const AppInit = () => {
  useEffect(() => {
    axios.get('https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.iocontainerapps.io/api/csrf/', {
      withCredentials: true,
    })
    .then(() => console.log('✅ CSRF token fetched'))
    .catch(() => console.warn('❌ CSRF fetch failed'));
  }, []);

  return null;
};

export default AppInit;
