import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Register.css';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/Form/RegisterForm';
import RegisterPopup from '../../components/Popup/RegisterPopup';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setShowPopup(false);

    const { username, email, password1, password2, first_name, last_name } = formData;

    if (password1 !== password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/register/`,
        {
          username,
          email,
          password: password1,
          first_name,
          last_name
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setShowPopup(true);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
<div className="register-wrapper d-flex flex-column flex-md-row w-100 bg-light py-5" style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '10px' }}>

  {/* Image Column */}
  <div className="register-image">
    <img
      src="/media/images/register-banner.png"
      alt="Register Banner"
      className="img-fluid w-100 h-100"
      style={{ objectFit: 'cover' }}
    />
  </div>

  {/* Form Column */}
<div
  className="register-form-col d-flex align-items-center justify-content-center bg-white p-5 shadow-sm"
  style={{
    width: '40%',
    padding: '2rem'
  }}
>
  <div style={{ width: '100%', maxWidth: '500px' }}>
    <RegisterForm
      formData={formData}
      handleChange={handleChange}
      handleRegister={handleRegister}
      error={error}
    />
    {showPopup && <RegisterPopup />}
  </div>
</div>

</div>



  );
};

export default Register;
