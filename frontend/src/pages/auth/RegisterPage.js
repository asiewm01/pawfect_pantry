import React, { useState } from 'react';
import axios from 'axios';
import './css/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { username, email, password1, password2, first_name, last_name } = formData;

    if (password1 !== password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/register/`, {
        username,
        email,
        password: password1,
        first_name,
        last_name
      }, {
        withCredentials: true
      });

      if (response.status === 201) {
        setMessage("Registration successful! You can now log in.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleRegister} className="register-form">
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input name="password1" type="password" placeholder="Password" value={formData.password1} onChange={handleChange} required />
        <input name="password2" type="password" placeholder="Confirm Password" value={formData.password2} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
