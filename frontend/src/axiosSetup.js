// src/axiosSetup.js
import axios from 'axios';

// ✅ Create a configured Axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  }
});

// ✅ Utility function to get CSRF token from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

// ✅ Automatically attach CSRF token to mutating requests
instance.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
}, (error) => Promise.reject(error));

export default instance;
